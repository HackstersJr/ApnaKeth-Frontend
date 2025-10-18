import { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

interface LatLng {
  lat: number;
  lng: number;
}

interface LandArea {
  id: string;
  name: string;
  coordinates: LatLng[];
  area: number;
  crop?: string;
}

interface Partition {
  id: string;
  name: string;
  coordinates: LatLng[];
  parentLandId: string;
  crop?: string;
}

interface OnboardingMapProps {
  onLocationSelect: (location: LatLng, address?: string) => void;
  selectedLocation?: LatLng;
  className?: string;
  isDrawingLand?: boolean;
  onLandDraw?: (coordinates: LatLng[]) => void;
  lands?: LandArea[];
  selectedLandId?: string | null;
  onLandSelect?: (landId: string) => void;
  isDrawingPartition?: boolean;
  onPartitionDraw?: (coordinates: LatLng[]) => void;
  partitions?: Partition[];
  selectedPartitionId?: string | null;
  onPartitionSelect?: (partitionId: string) => void;
  step: 'location' | 'land-selection' | 'partitioning' | 'dashboard';
}

async function reverseGeocode(lat: number, lng: number): Promise<string> {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`
    );
    const data = await response.json();
    return data.display_name || `${lat.toFixed(4)}, ${lng.toFixed(4)}`;
  } catch {
    return `${lat.toFixed(4)}, ${lng.toFixed(4)}`;
  }
}

// Check if a point is inside a polygon using ray casting algorithm
function isPointInPolygon(point: LatLng, polygon: LatLng[]): boolean {
  const x = point.lat;
  const y = point.lng;
  let inside = false;

  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    const xi = polygon[i].lat;
    const yi = polygon[i].lng;
    const xj = polygon[j].lat;
    const yj = polygon[j].lng;

    if (((yi > y) !== (yj > y)) && (x < (xj - xi) * (y - yi) / (yj - yi) + xi)) {
      inside = !inside;
    }
  }
  return inside;
}

// Check if all points of a polygon are inside another polygon
function isPolygonInsidePolygon(innerPoly: LatLng[], outerPoly: LatLng[]): boolean {
  return innerPoly.every(point => isPointInPolygon(point, outerPoly));
}

export function OnboardingMapComponent({
  onLocationSelect,
  selectedLocation,
  className = '',
  isDrawingLand = false,
  onLandDraw,
  lands = [],
  selectedLandId,
  onLandSelect,
  isDrawingPartition = false,
  onPartitionDraw,
  partitions = [],
  selectedPartitionId,
  onPartitionSelect,
  step
}: OnboardingMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const leafletMapRef = useRef<L.Map | null>(null);
  const markersRef = useRef<L.Marker[]>([]);
  const polygonsRef = useRef<L.Polygon[]>([]);
  const drawingPointsRef = useRef<LatLng[]>([]);
  const [userLocation, setUserLocation] = useState<LatLng | null>(null);
  const [drawingPoints, setDrawingPoints] = useState<LatLng[]>([]);
  const [isLocating, setIsLocating] = useState(false);
  const [hasZoomedToLand, setHasZoomedToLand] = useState(false);

  // Auto-zoom to selected land during partitioning step
  useEffect(() => {
    const map = leafletMapRef.current;
    if (!map || step !== 'partitioning') {
      setHasZoomedToLand(false);
      return;
    }

    // Find the selected land or use the first land if none selected
    const targetLand = selectedLandId 
      ? lands.find(land => land.id === selectedLandId)
      : lands[0];
    
    if (targetLand && targetLand.coordinates.length > 0 && !hasZoomedToLand) {
      // Create bounds from land coordinates
      const bounds = L.latLngBounds(
        targetLand.coordinates.map(coord => [coord.lat, coord.lng])
      );
      
      // Smooth zoom to land with animation
      setTimeout(() => {
        map.fitBounds(bounds, { 
          padding: [30, 30],
          maxZoom: 16,
          animate: true,
          duration: 1.0
        });
      }, 300);
      
      setHasZoomedToLand(true);
    }
  }, [step, selectedLandId, lands, hasZoomedToLand]);

  // Initialize map - only once
  useEffect(() => {
    if (!mapRef.current || leafletMapRef.current) return;

    const map = L.map(mapRef.current, {
      zoomControl: true,
      attributionControl: true,
    }).setView([28.6139, 77.2090], 13);
    
    leafletMapRef.current = map;

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors',
      maxZoom: 19,
      keepBuffer: 4,
    }).addTo(map);

    // Ensure map renders properly
    setTimeout(() => {
      map.invalidateSize();
    }, 100);

    return () => {
      // Cleanup on unmount
      if (leafletMapRef.current) {
        leafletMapRef.current.remove();
        leafletMapRef.current = null;
      }
    };
  }, []);

  // Handle map clicks for drawing and location selection
  useEffect(() => {
    const map = leafletMapRef.current;
    if (!map) return;

    // Remove previous handlers
    map.off('click');
    map.off('dblclick');

    const handleClick = async (e: L.LeafletMouseEvent) => {
      L.DomEvent.stop(e);
      L.DomEvent.preventDefault(e.originalEvent);

      const { lat, lng } = e.latlng;

      if (step === 'location') {
        const address = await reverseGeocode(lat, lng);
        onLocationSelect({ lat, lng }, address);
      } else if ((step === 'land-selection' && isDrawingLand) || (step === 'partitioning' && isDrawingPartition)) {
        // Add visual feedback for click
        const tempMarker = L.circleMarker([lat, lng], {
          radius: 15,
          fillColor: step === 'land-selection' ? '#22c55e' : '#3b82f6',
          color: '#ffffff',
          weight: 2,
          opacity: 1,
          fillOpacity: 0.3
        }).addTo(map);
        
        // Remove temp marker after short animation
        setTimeout(() => {
          map.removeLayer(tempMarker);
        }, 200);
        
        // Add point to drawing
        const newPoints = [...drawingPointsRef.current, { lat, lng }];
        drawingPointsRef.current = newPoints;
        setDrawingPoints(newPoints);
      }
    };

    const handleDblClick = (e: L.LeafletMouseEvent) => {
      L.DomEvent.stop(e);
      L.DomEvent.preventDefault(e.originalEvent);

      const isDrawing = (step === 'land-selection' && isDrawingLand) || (step === 'partitioning' && isDrawingPartition);
      const hasEnoughPoints = drawingPointsRef.current.length >= 3;

      if (isDrawing && hasEnoughPoints) {
        const points = [...drawingPointsRef.current];
        
        if (step === 'land-selection') {
          onLandDraw?.(points);
        } else if (step === 'partitioning') {
          // Validate partition is inside land
          const targetLand = selectedLandId 
            ? lands.find(land => land.id === selectedLandId)
            : lands[0];
            
          if (targetLand && !isPolygonInsidePolygon(points, targetLand.coordinates)) {
            alert('🚫 Partition must be drawn inside the selected land area!');
            drawingPointsRef.current = [];
            setDrawingPoints([]);
            return;
          }
          
          onPartitionDraw?.(points);
        }
        
        drawingPointsRef.current = [];
        setDrawingPoints([]);
      }
    };

    map.on('click', handleClick);
    map.on('dblclick', handleDblClick);

    return () => {
      map.off('click', handleClick);
      map.off('dblclick', handleDblClick);
    };
  }, [step, isDrawingLand, isDrawingPartition, onLocationSelect, onLandDraw, onPartitionDraw, selectedLandId, lands]);

  // Control map dragging and cursor based on drawing mode
  useEffect(() => {
    const map = leafletMapRef.current;
    if (!map) return;

    if (isDrawingLand || isDrawingPartition) {
      map.dragging.disable();
      map.boxZoom.disable();
      map.keyboard.disable();
      map.scrollWheelZoom.disable();
      // Change cursor to crosshair for drawing
      map.getContainer().style.cursor = 'crosshair';
    } else {
      map.dragging.enable();
      map.boxZoom.enable();
      map.keyboard.enable();
      map.scrollWheelZoom.enable();
      // Reset cursor
      map.getContainer().style.cursor = '';
    }
    
    // Force map to refresh and maintain visibility
    setTimeout(() => {
      map.invalidateSize();
    }, 0);
  }, [isDrawingLand, isDrawingPartition]);

  // Update drawing visualization (only drawing points and temporary polygon)
  useEffect(() => {
    const map = leafletMapRef.current;
    if (!map) return;

    // Clear only drawing-related markers (not land/partition markers)
    const currentDrawingMarkers = [...markersRef.current];
    markersRef.current = [];

    currentDrawingMarkers.forEach(m => {
      try {
        if (map.hasLayer(m)) {
          map.removeLayer(m);
        }
      } catch (e) {
        // Ignore errors during cleanup
      }
    });

    // Only show drawing points when actively drawing
    if ((isDrawingLand || isDrawingPartition) && drawingPoints.length > 0) {
      // Create colored circles for drawing points
      const pointColor = step === 'land-selection' ? '#22c55e' : '#3b82f6';
      drawingPoints.forEach((point, index) => {
        const circle = L.circleMarker([point.lat, point.lng], {
          radius: 10,
          fillColor: pointColor,
          color: '#ffffff',
          weight: 3,
          opacity: 1,
          fillOpacity: 0.9
        }).addTo(map);
        
        circle.bindPopup(`📍 Point ${index + 1}`, { 
          closeButton: false,
          autoClose: false,
          className: 'custom-popup'
        });
        
        // Add hover effect
        circle.on('mouseover', () => {
          circle.setStyle({
            radius: 12,
            fillOpacity: 1
          });
        });
        
        circle.on('mouseout', () => {
          circle.setStyle({
            radius: 10,
            fillOpacity: 0.9
          });
        });
        
        markersRef.current.push(circle as any);
      });

      // Update drawing polygon preview
      if (drawingPoints.length >= 2) {
        const tempPolygon = L.polygon(
          drawingPoints.map(p => [p.lat, p.lng]),
          {
            color: pointColor,
            fillColor: pointColor,
            fillOpacity: 0.2,
            weight: 3,
            dashArray: '10, 5',
            opacity: 0.8
          }
        ).addTo(map);
        markersRef.current.push(tempPolygon as any);
      }
    }
  }, [drawingPoints, step, isDrawingLand, isDrawingPartition]);

  // Update land and partition visualization
  useEffect(() => {
    const map = leafletMapRef.current;
    if (!map) return;

    // Remove old land/partition polygons
    const currentPolygons = [...polygonsRef.current];
    polygonsRef.current = [];
    
    currentPolygons.forEach(p => {
      try {
        if (map.hasLayer(p)) {
          map.removeLayer(p);
        }
      } catch (e) {
        // Ignore errors during cleanup
      }
    });

    const isDrawingMode = isDrawingLand || isDrawingPartition;

    // Render lands
    lands.forEach((land) => {
      const isSelected = selectedLandId === land.id;
      
      const polygon = L.polygon(
        land.coordinates.map(c => [c.lat, c.lng]),
        {
          color: isSelected ? '#16a34a' : '#22c55e',
          fillColor: isSelected ? '#16a34a' : '#22c55e',
          fillOpacity: isSelected ? 0.3 : (isDrawingMode ? 0.25 : 0.15),
          weight: isSelected ? 4 : 3,
          opacity: isDrawingMode ? 0.9 : 0.8,
          // Disable interaction during drawing mode
          interactive: !isDrawingMode
        }
      )
        .bindPopup(`🌾 ${land.name}<br/>Area: ${land.area.toFixed(2)} acres`, {
          closeButton: false,
          className: 'land-popup'
        })
        .addTo(map);
        
      // Only add click handler if not drawing
      if (!isDrawingMode) {
        polygon.on('click', () => onLandSelect?.(land.id));
        polygon.on('mouseover', () => {
          polygon.setStyle({ fillOpacity: isSelected ? 0.4 : 0.25 });
        });
        polygon.on('mouseout', () => {
          polygon.setStyle({ fillOpacity: isSelected ? 0.3 : 0.15 });
        });
      }
      
      polygonsRef.current.push(polygon);
    });

    // Render partitions
    partitions.forEach((partition) => {
      const isSelected = selectedPartitionId === partition.id;
      
      const polygon = L.polygon(
        partition.coordinates.map(c => [c.lat, c.lng]),
        {
          color: isSelected ? '#1d4ed8' : '#3b82f6',
          fillColor: isSelected ? '#1d4ed8' : '#3b82f6',
          fillOpacity: isSelected ? 0.3 : 0.2,
          weight: isSelected ? 3 : 2,
          opacity: 0.9,
          // Disable interaction during drawing mode
          interactive: !isDrawingMode
        }
      )
        .bindPopup(`✂️ ${partition.name}`, {
          closeButton: false,
          className: 'partition-popup'
        })
        .addTo(map);
        
      // Only add click handler if not drawing
      if (!isDrawingMode) {
        polygon.on('click', () => onPartitionSelect?.(partition.id));
        polygon.on('mouseover', () => {
          polygon.setStyle({ fillOpacity: isSelected ? 0.4 : 0.3 });
        });
        polygon.on('mouseout', () => {
          polygon.setStyle({ fillOpacity: isSelected ? 0.3 : 0.2 });
        });
      }
      
      polygonsRef.current.push(polygon);
    });
    
    // Ensure map displays properly after updating layers
    setTimeout(() => {
      map.invalidateSize();
    }, 0);
  }, [lands, partitions, selectedLandId, selectedPartitionId, isDrawingLand, isDrawingPartition, onLandSelect, onPartitionSelect]);

  // Update map center
  useEffect(() => {
    const map = leafletMapRef.current;
    if (map && selectedLocation) {
      map.setView([selectedLocation.lat, selectedLocation.lng], 16);
    }
  }, [selectedLocation]);

  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported');
      return;
    }

    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const loc = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        setUserLocation(loc);
        onLocationSelect(loc);
        if (leafletMapRef.current) leafletMapRef.current.setView([loc.lat, loc.lng], 13);
        setIsLocating(false);
      },
      () => {
        alert('Unable to get location');
        setIsLocating(false);
      }
    );
  };

  // Add markers
  useEffect(() => {
    const map = leafletMapRef.current;
    if (!map) return;

    if (userLocation) {
      L.marker([userLocation.lat, userLocation.lng]).addTo(map)
        .bindPopup(`📱 Current<br/>${userLocation.lat.toFixed(4)}, ${userLocation.lng.toFixed(4)}`);
    }

    if (selectedLocation && selectedLocation !== userLocation) {
      L.marker([selectedLocation.lat, selectedLocation.lng]).addTo(map)
        .bindPopup(`🌾 Selected<br/>${selectedLocation.lat.toFixed(4)}, ${selectedLocation.lng.toFixed(4)}`);
    }
  }, [userLocation, selectedLocation]);

  useEffect(() => {
    if (!isDrawingLand && !isDrawingPartition) {
      setDrawingPoints([]);
    }
  }, [isDrawingLand, isDrawingPartition]);

  return (
    <div className={`relative ${className}`}>
      <div className="absolute top-4 left-4 z-[1000] space-y-2">
        {step === 'location' && (
          <>
            <button
              onClick={getCurrentLocation}
              disabled={isLocating}
              className="bg-white hover:bg-gray-50 text-gray-800 font-semibold py-2 px-4 rounded-lg shadow-lg border border-gray-200 transition-colors disabled:opacity-50"
            >
              {isLocating ? '📍 Finding...' : '🎯 Use Current Location'}
            </button>
            <div className="bg-white/95 backdrop-blur rounded-lg p-3 shadow-lg border border-gray-200 text-sm">
              <p className="font-semibold text-gray-800">📍 Step 1: Location</p>
              <p className="text-gray-600">Click on map to select</p>
            </div>
          </>
        )}

        {step === 'land-selection' && (
          <>
            <div className="bg-white/95 backdrop-blur rounded-lg p-3 shadow-lg border border-gray-200 text-sm">
              <p className="font-semibold text-gray-800">🌾 Step 2: Draw Land</p>
              <p className="text-gray-600">
                {isDrawingLand 
                  ? `Click to add points (${drawingPoints.length} points)` 
                  : 'Start drawing'
                }
              </p>
              {isDrawingLand && drawingPoints.length >= 3 && (
                <p className="text-xs text-green-600 mt-1">
                  ✅ Ready to finish! Click the button below.
                </p>
              )}
            </div>
            {isDrawingLand && drawingPoints.length >= 3 && (
              <button
                onClick={() => {
                  const points = [...drawingPointsRef.current];
                  onLandDraw?.(points);
                  drawingPointsRef.current = [];
                  setDrawingPoints([]);
                }}
                className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded-lg shadow-lg transition-all duration-200 transform hover:scale-105"
              >
                ✓ Finish Drawing
              </button>
            )}
          </>
        )}

        {step === 'partitioning' && (
          <>
            <div className="bg-white/95 backdrop-blur rounded-lg p-3 shadow-lg border border-gray-200 text-sm">
              <p className="font-semibold text-gray-800">✂️ Step 3: Partitions</p>
              <p className="text-gray-600">
                {isDrawingPartition 
                  ? `Click inside the green area (${drawingPoints.length} points)` 
                  : 'Add partitions inside your land'
                }
              </p>
              {!isDrawingPartition && (
                <p className="text-xs text-blue-600 mt-1">
                  💡 Map focused on your land for easier partitioning
                </p>
              )}
              {isDrawingPartition && drawingPoints.length >= 3 && (
                <p className="text-xs text-green-600 mt-1">
                  ✅ Ready to finish! Click the button below.
                </p>
              )}
            </div>
            {isDrawingPartition && drawingPoints.length >= 3 && (
              <button
                onClick={() => {
                  const points = [...drawingPointsRef.current];
                  
                  // Validate that partition is inside a land
                  const targetLand = selectedLandId 
                    ? lands.find(land => land.id === selectedLandId)
                    : lands[0];
                    
                  if (targetLand && !isPolygonInsidePolygon(points, targetLand.coordinates)) {
                    alert('🚫 Partition must be drawn inside the selected land area!');
                    return;
                  }
                  
                  onPartitionDraw?.(points);
                  drawingPointsRef.current = [];
                  setDrawingPoints([]);
                }}
                className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg shadow-lg transition-all duration-200 transform hover:scale-105"
              >
                ✓ Finish Drawing
              </button>
            )}
          </>
        )}

        {step === 'dashboard' && (
          <div className="bg-white/95 backdrop-blur rounded-lg p-3 shadow-lg border border-gray-200 text-sm">
            <p className="font-semibold text-gray-800">📊 Dashboard</p>
            <p className="text-gray-600">Click land/partition to select</p>
          </div>
        )}
      </div>

      <div ref={mapRef} 
           className={`w-full h-full rounded-xl ${(isDrawingLand || isDrawingPartition) ? 'drawing-mode' : ''}`} 
           style={{ borderRadius: '12px' }} />
    </div>
  );
}
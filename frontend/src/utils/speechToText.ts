class SpeechToTextService {
  private recognition: any = null;
  private onResultCallback: ((transcript: string) => void) | null = null;
  private onListeningChangeCallback: ((listening: boolean) => void) | null = null;
  private onInterimCallback: ((interim: string) => void) | null = null;

  constructor() {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        this.recognition = new SpeechRecognition();
        this.recognition.continuous = false;
        this.recognition.interimResults = true;
        this.recognition.maxAlternatives = 1;

        this.recognition.onstart = () => {
          console.log('🎤 Speech recognition started');
          this.onListeningChangeCallback?.(true);
        };

        this.recognition.onresult = (event: any) => {
          let finalTranscript = '';
          let interimTranscript = '';

          for (let i = event.resultIndex; i < event.results.length; i++) {
            const transcript = event.results[i][0].transcript;
            if (event.results[i].isFinal) {
              finalTranscript += transcript;
            } else {
              interimTranscript += transcript;
            }
          }

          if (interimTranscript) {
            this.onInterimCallback?.(interimTranscript);
          }

          if (finalTranscript) {
            console.log('✅ Final transcript:', finalTranscript);
            this.onResultCallback?.(finalTranscript);
          }
        };

        this.recognition.onerror = (event: any) => {
          console.error('❌ Speech recognition error:', event.error);
          this.onListeningChangeCallback?.(false);
        };

        this.recognition.onend = () => {
          console.log('🛑 Speech recognition ended');
          this.onListeningChangeCallback?.(false);
        };
      }
    }
  }

  public isSupported(): boolean {
    return this.recognition !== null;
  }

  public setLanguage(lang: string) {
    if (this.recognition) {
      this.recognition.lang = lang;
    }
  }

  public start(
    onResult: (transcript: string) => void,
    onListeningChange: (listening: boolean) => void,
    onInterim?: (interim: string) => void
  ) {
    if (!this.recognition) {
      console.error('Speech recognition not supported');
      return;
    }

    this.onResultCallback = onResult;
    this.onListeningChangeCallback = onListeningChange;
    this.onInterimCallback = onInterim || null;

    try {
      this.recognition.start();
    } catch (error) {
      console.error('Error starting speech recognition:', error);
    }
  }

  public stop() {
    if (this.recognition) {
      this.recognition.stop();
    }
  }
}

export const speechToText = new SpeechToTextService();

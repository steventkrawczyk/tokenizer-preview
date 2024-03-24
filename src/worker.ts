import { AutoTokenizer, env } from '@xenova/transformers';

// Skip local model check
env.allowLocalModels = false;

type ProgressCallback = (progress: any) => void;

// Use the Singleton pattern to enable lazy construction of the pipeline.
class PipelineSingleton {
    private static tokenizerPromise = AutoTokenizer.from_pretrained('Xenova/bert-base-uncased');
    private static instance: ReturnType<any> | null = null;

    static async getInstance(progress_callback: ProgressCallback | null = null): Promise<ReturnType<typeof AutoTokenizer.from_pretrained>> {
        if (this.instance === null) {
            this.instance = await this.tokenizerPromise;
        }
        return this.instance;
    }
}

// Define a type for the message event to handle the data structure
interface TokenizerMessageEvent extends MessageEvent {
    data: {
        text: string;
    };
}

// Listen for messages from the main thread
self.addEventListener('message', async (event: TokenizerMessageEvent) => {
    const tokenizer = await PipelineSingleton.getInstance((x: any) => {
        self.postMessage(x);
    });

    // Tokenize the text to get input IDs
    const { input_ids } = await tokenizer(event.data.text);
    const ids = input_ids.data

    // Convert input IDs back to tokens for human-readable text
    const input_ids_as_numbers = Array.from(ids, id => Number(id));
    const tokens = tokenizer.model.convert_ids_to_tokens(input_ids_as_numbers);

    self.postMessage({
        status: 'complete',
        output: tokens,
    });
});
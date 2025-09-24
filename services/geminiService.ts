import { GoogleGenAI } from "@google/genai";

async function generateLyrics(prompt: string, ai: GoogleGenAI): Promise<string> {
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: `You are a creative songwriter. Write a short song with lyrics based on the following theme: "${prompt}". Include verse and chorus sections.`,
        });
        return response.text;
    } catch (error) {
        console.error("Error generating lyrics:", error);
        return "Lyrics could not be generated for this track.";
    }
}

export async function generateTrack(prompt: string, apiKey: string): Promise<{ mediaUrl: string; lyrics: string; }> {
  const ai = new GoogleGenAI({ apiKey });

  try {
    // New prompt: Instruct the AI to focus on audio quality and use a simple visual,
    // which is more effective for a video-generation model.
    const videoPrompt = `An audio track of a song with vocals about "${prompt}". The video can be a simple, static image or an abstract visualizer, but the main focus is high-quality audio with music and singing.`;

    // Generate lyrics and video in parallel to save time
    const [lyrics, videoOperation] = await Promise.all([
        generateLyrics(prompt, ai),
        ai.models.generateVideos({
            model: 'veo-2.0-generate-001',
            prompt: videoPrompt,
            config: {
                numberOfVideos: 1,
            },
        })
    ]);

    let operation = videoOperation;
    // Poll for the video result
    while (!operation.done) {
      await new Promise(resolve => setTimeout(resolve, 10000));
      operation = await ai.operations.getVideosOperation({ operation: operation });
    }

    const downloadLink = operation.response?.generatedVideos?.[0]?.video?.uri;

    if (!downloadLink) {
      throw new Error("Video generation succeeded but no download link was found.");
    }
    
    const videoUrl = `${downloadLink}&key=${apiKey}`;
    
    return { mediaUrl: videoUrl, lyrics };

  } catch (error) {
    console.error("Error generating track with Gemini:", error);
    if (error instanceof Error) {
        if (error.message.includes('API key not valid')) {
            throw new Error('Your Gemini API key is not valid. Please check it in settings.');
        }
        throw new Error(`Failed to generate music: ${error.message}`);
    }
    throw new Error("An unknown error occurred while generating music.");
  }
}
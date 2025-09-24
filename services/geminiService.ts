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
    // Step 1: Generate lyrics first to ensure vocals match.
    const lyrics = await generateLyrics(prompt, ai);
    if (lyrics === "Lyrics could not be generated for this track.") {
        throw new Error("Failed to generate lyrics, cannot proceed with audio generation.");
    }

    // Step 2: Create a detailed prompt for the video/audio generation model,
    // instructing it to use the generated lyrics for the vocals.
    const videoPrompt = `An audio track of a song with vocals. The style should be "${prompt}". The vocals must sing these lyrics exactly: \n\n${lyrics}\n\nThe video can be a simple, static image or an abstract visualizer. The main focus is high-quality audio with music and singing that follows the provided lyrics.`;

    // Step 3: Generate the video, which contains the final audio track.
    let operation = await ai.models.generateVideos({
        model: 'veo-2.0-generate-001',
        prompt: videoPrompt,
        config: {
            numberOfVideos: 1,
        },
    });

    // Step 4: Poll for the video result. This can take a few minutes.
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
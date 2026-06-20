// ai moderation class
import axios from "axios";

export class AICoordinator {
  private endpoint =
    process.env.AI_ENDPOINT || "http://localhost:11434/api/generate";

  async checkContent(
    text: string,
  ): Promise<{ isSafe: boolean; reason?: string }> {
    try {
      const response = await axios.post(this.endpoint, {
        model: process.env.AI_MODEL || "llama3.2",
        prompt: `Analyze this tweet: "${text}". Is it hate speech, spam, or harassment? 
                 Respond only in JSON format: {"isSafe": boolean, "reason": "string"}`,
        stream: false,
        format: "json",
      });

      return JSON.parse(response.data.response);
    } catch (error) {
      console.error("AI Moderation failed, defaulting to safe:", error);
      return { isSafe: true };
    }
  }

  async checkMedia(
    mediaUrl: string,
  ): Promise<{ isSafe: boolean; reason?: string }> {
    try {
      const response = await axios.post(this.endpoint, {
        model: process.env.AI_MODEL || "llama3.2",
        prompt: `Analyze this image: "${mediaUrl}". Is it hate speech, spam, or harassment? 
                 Respond only in JSON format: {"isSafe": boolean, "reason": "string"}`,
        stream: false,
        format: "json",
      });

      return JSON.parse(response.data.response);
    } catch (error) {
      console.error("AI Moderation failed, defaulting to safe:", error);
      return { isSafe: true };
    }
  }
}

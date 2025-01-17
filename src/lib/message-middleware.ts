import { db } from './db';
import { ChatOpenAI } from "@langchain/openai";
import { PromptTemplate } from "@langchain/core/prompts";
import { auth, currentUser } from "@clerk/nextjs";

const openai = new ChatOpenAI({
  modelName: process.env.OPENAI_MODEL,
  temperature: 0.7,
  openAIApiKey: process.env.OPENAI_API_KEY,
});

const proofreadPrompt = PromptTemplate.fromTemplate(`
You are a helpful message proofreader. Review and improve this message while maintaining its meaning and tone:

Message: {message}

Provide only the improved message without any explanations.
`);

export async function handleMessageSend(message: {
  content: string;
  userId: string;
  channelId?: string;
  recipientId?: string;
}) {
  console.log('Message middleware called:', message);

  try {
    // Get user from Clerk
    const user = await currentUser();
    if (!user) {
      console.log('No user found in Clerk');
      return message;
    }

    // Find database user by email
    const dbUser = await db.user.findFirst({
      where: {
        email: user.emailAddresses[0].emailAddress
      }
    });

    if (!dbUser) {
      console.log('No database user found');
      return message;
    }

    // Check user's proofing settings using database userId
    const settings = await db.aIProofingSettings.findUnique({
      where: { userId: dbUser.id }
    });

    console.log('User proofing settings:', settings);

    if (!settings || settings.proofingMode !== 'after') {
      console.log('Proofing skipped - disabled or not set to after');
      return message;
    }

    console.log('Starting message proofing');
    
    const formattedPrompt = await proofreadPrompt.format({
      message: message.content
    });

    const response = await openai.invoke(formattedPrompt);
    const improved = String(response.content);

    console.log('Proofing completed:', {
      original: message.content,
      improved
    });

    // Return message with improved content, prefix and isAIResponse flag
    return {
      ...message,
      content: `[AI edited] ${improved}`,
      isAIResponse: true
    };
  } catch (error) {
    console.error('Auto-proofing error:', error);
    return message;
  }
} 
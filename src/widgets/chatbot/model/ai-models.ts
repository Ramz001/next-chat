export const models = [
  {
    chef: 'Google',
    chefSlug: 'google',
    id: 'google/gemini-3-flash',
    name: 'Gemini 3 Flash',
    providers: ['google', 'google vertex'],
  },
  {
    chef: 'OpenAI',
    chefSlug: 'openai',
    id: 'openai/gpt-5-mini',
    name: 'GPT-5 Mini',
    providers: ['openai', 'azure'],
  },
  {
    chef: 'Moonshot AI',
    chefSlug: 'moonshotai',
    id: 'moonshotai/kimi-k2',
    name: 'Kimi K2',
    providers: [
      'deepinfra',
      'fireworks',
      'moonshot-ai',
      'novita-ai',
      'parasail',
    ],
  },
]

export const ALLOWED_MODELS = models.map((model) => model.id) 

export const suggestions = [
  'What are the latest trends in AI?',
  'How does machine learning work?',
  'Explain quantum computing',
  'Best practices for React development',
  'Tell me about TypeScript benefits',
  'How to optimize database queries?',
  'What is the difference between SQL and NoSQL?',
  'Explain cloud computing basics',
]

export const chefs = ['Google', 'OpenAI', 'Moonshot AI']

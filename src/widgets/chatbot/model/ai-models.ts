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
  'What are the current sustainability regulations in Uzbekistan?',
  'How can our organisation align with the Future Generations principles?',
  'Explain the latest environmental laws regarding waste management.',
  'What are the policies on renewable energy adoption?',
  'Как мы можем внедрить экологические стандарты на нашем предприятии?',
  'O‘zbekiston Respublikasining ekologik qonunchiligi qanday?',
]

export const chefs = ['Google', 'OpenAI', 'Moonshot AI']

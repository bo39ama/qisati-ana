import Anthropic from '@anthropic-ai/sdk'
import type { Story, ChildInfo, Language, IllustrationStyle } from '@/types'

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

// ─── Types ────────────────────────────────────────────────────────────────────

export interface StoryPage {
  page: number
  text: string
  image_prompt: string
}

export interface GeneratedStory {
  title: string
  pages: StoryPage[]
  dedication?: string
  tokens_used: number
}

// ─── Main Generator ───────────────────────────────────────────────────────────

export async function generateStory(
  story: Story,
  child: ChildInfo,
  style: IllustrationStyle,
  language: Language = 'ar'
): Promise<GeneratedStory> {

  const prompt = buildStoryPrompt(story, child, language)
  const imageStyleGuide = getStyleGuide(style)

  const response = await anthropic.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 4000,
    messages: [{
      role: 'user',
      content: prompt
    }],
    system: buildSystemPrompt(language, imageStyleGuide)
  })

  const content = response.content[0]
  if (content.type !== 'text') throw new Error('Unexpected response type')

  const parsed = parseStoryResponse(content.text, child, story)

  return {
    ...parsed,
    tokens_used: response.usage.input_tokens + response.usage.output_tokens
  }
}

// ─── Prompt Builder ───────────────────────────────────────────────────────────

function buildSystemPrompt(language: Language, styleGuide: string): string {
  if (language === 'ar') {
    return `أنت كاتب قصص أطفال محترف عربي. تكتب قصصاً جميلة، تعليمية، ومناسبة للأعمار.
    
قواعد الكتابة:
- اللغة العربية الفصحى المبسطة المناسبة للأطفال
- اسم الطفل يظهر في كل صفحة تقريباً
- جمل قصيرة وواضحة (٣-٤ جمل لكل صفحة)
- نهاية إيجابية وملهمة
- لا عنف، لا خوف مفرط

لكل صفحة أيضاً: اكتب وصفاً للصورة بالإنجليزية بعد النص.
Style guide for images: ${styleGuide}

أجب بصيغة JSON فقط بدون أي نص إضافي.`
  }

  return `You are a professional children's story writer. Write beautiful, educational, age-appropriate stories.
  
Writing rules:
- Simple, clear English suitable for children
- Child's name appears on almost every page
- Short clear sentences (3-4 sentences per page)
- Positive, inspiring ending
- No violence, no excessive fear

Style guide for images: ${styleGuide}

Respond in JSON format only, no additional text.`
}

function buildStoryPrompt(story: Story, child: ChildInfo, language: Language): string {
  const basePrompt = language === 'ar' ? story.text_prompt_ar : story.text_prompt_en
  if (!basePrompt) throw new Error('Story prompt not configured')

  const personality = child.personality?.join('، ') || 'مرح وفضولي'
  const genderAr = child.gender === 'male' ? 'ولد' : 'بنت'

  let prompt = basePrompt
    .replace(/\[CHILD_NAME\]/g, child.name)
    .replace(/\[AGE\]/g, `${child.age} سنوات`)
    .replace(/\[GENDER\]/g, language === 'ar' ? genderAr : child.gender)
    .replace(/\[PERSONALITY\]/g, personality)
    .replace(/\[ANIMAL\]/g, child.favorite_animal || '')
    .replace(/\[COLOR\]/g, child.favorite_color || '')
    .replace(/\[HOBBY\]/g, child.favorite_hobby || '')
    .replace(/\[DREAM\]/g, child.dream_job || '')

  const dedication = child.dedication_message
    ? `\n\nأضف صفحة إهداء في البداية بهذا النص: "${child.dedication_message}"`
    : ''

  return `${prompt}${dedication}

أجب بهذا الـ JSON بالضبط:
{
  "title": "عنوان القصة",
  "dedication": "نص الإهداء إن وجد أو null",
  "pages": [
    {
      "page": 1,
      "text": "نص الصفحة بالعربية",
      "image_prompt": "Detailed English description for image generation: [specific scene], ${child.gender} child named ${child.name}, age ${child.age}, [art style details]"
    }
  ]
}`
}

function parseStoryResponse(
  responseText: string,
  child: ChildInfo,
  story: Story
): Omit<GeneratedStory, 'tokens_used'> {
  try {
    // Clean up response (remove any markdown if present)
    const cleaned = responseText
      .replace(/```json\n?/g, '')
      .replace(/```\n?/g, '')
      .trim()

    const parsed = JSON.parse(cleaned)

    return {
      title: parsed.title || story.title_ar,
      pages: parsed.pages || [],
      dedication: parsed.dedication || undefined,
    }
  } catch {
    throw new Error(`Failed to parse story response: ${responseText.substring(0, 200)}`)
  }
}

// ─── Style Guide ─────────────────────────────────────────────────────────────

function getStyleGuide(style: IllustrationStyle): string {
  const guides: Record<IllustrationStyle, string> = {
    watercolor: 'Soft watercolor illustration style, gentle brushstrokes, pastel colors, dreamy and warm atmosphere, professional children\'s book quality',
    '3d': 'Pixar-inspired 3D illustration style, vibrant colors, expressive characters, modern and polished look, high quality render',
    classic: 'Classic storybook illustration style, detailed pen and ink with color washes, timeless and elegant, reminiscent of vintage children\'s books',
    soft_cartoon: 'Soft cartoon illustration style, simple rounded shapes, bright friendly colors, clean lines, suitable for young children',
    fantasy: 'Fantasy illustration style, magical and detailed, rich colors, ethereal lighting, fairy-tale atmosphere',
    comic: 'Comic book illustration style, bold lines, dynamic compositions, vibrant saturated colors, energetic and fun',
  }
  return guides[style] || guides.watercolor
}

// ─── Image Prompt Enhancement ─────────────────────────────────────────────────

export function enhanceImagePrompt(
  basePrompt: string,
  child: ChildInfo,
  style: IllustrationStyle,
  pageNumber: number
): string {
  const styleGuide = getStyleGuide(style)
  const childDesc = `${child.age}-year-old ${child.gender} child named ${child.name}`
  if (child.favorite_color) {
    // hint toward child's favorite color
  }

  return `${basePrompt}. The main character is a ${childDesc}. ${styleGuide}. Children's book illustration, page ${pageNumber}, safe for children, no text in image, high quality, professional illustration.`
}

// ─── Token Cost Estimator ─────────────────────────────────────────────────────

export function estimateGenerationCost(tokens: number): number {
  // claude-sonnet-4-6: ~$3 per 1M input, ~$15 per 1M output
  // Rough estimate: 60/40 split
  const inputCost = (tokens * 0.6) / 1_000_000 * 3
  const outputCost = (tokens * 0.4) / 1_000_000 * 15
  return inputCost + outputCost
}

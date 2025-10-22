import Anthropic from '@anthropic-ai/sdk'

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY
})

export type FileAnalysis = {
  category: string
  tags: string[]
  suggestedName?: string
  description?: string
}

export async function analyzeFile(
  fileName: string,
  mimeType: string,
  fileSize: number
): Promise<FileAnalysis> {
  const prompt = `Analyze this file and provide structured information:

File name: ${fileName}
Type: ${mimeType}
Size: ${fileSize} bytes

Provide:
1. Category (invoice, receipt, resume, contract, photo, document, spreadsheet, presentation, other)
2. Relevant tags (3-5 tags)
3. A better filename suggestion if the current one is unclear
4. Brief description

Respond in JSON format:
{
  "category": "string",
  "tags": ["tag1", "tag2", "tag3"],
  "suggestedName": "string or null",
  "description": "string"
}`

  const message = await anthropic.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 1024,
    messages: [
      {
        role: 'user',
        content: prompt
      }
    ]
  })

  const content = message.content[0]
  if (content.type !== 'text') {
    throw new Error('Unexpected response type')
  }

  const jsonMatch = content.text.match(/\{[\s\S]*\}/)
  if (!jsonMatch) {
    throw new Error('Could not parse AI response')
  }

  return JSON.parse(jsonMatch[0])
}

import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENROUTER_API_KEY,
  baseURL: "https://openrouter.ai/api/v1",
});

export async function POST(req: Request) {
  try {
    const formData = await req.formData();

    const image = formData.get("image") as File;

    if (!image) {
      return Response.json(
        { error: "No image uploaded" },
        { status: 400 }
      );
    }

    const bytes = await image.arrayBuffer();

    const base64 = Buffer.from(bytes).toString(
      "base64"
    );

    const completion =
      await openai.chat.completions.create({
        model: "qwen/qwen2.5-vl-72b-instruct",

        messages: [
          {
            role: "user",
            content: [
              {
                type: "text",
                text: `
You are the world's best image reverse engineer.

Analyze the uploaded image in extreme detail.

Study:

- Subject
- Face
- Hair
- Clothing
- Pose
- Expression
- Environment
- Lighting
- Camera angle
- Lens estimate
- Composition
- Color grading
- Art style
- Rendering style

Generate ONE highly detailed universal image generation prompt.

The prompt must recreate:
- Subject
- Lighting
- Camera setup
- Colors
- Mood
- Style
- Composition

Output ONLY the final prompt.
`
              },
              {
                type: "image_url",
                image_url: {
                  url:
                    `data:${image.type};base64,${base64}`
                }
              }
            ]
          }
        ]
      });

    return Response.json({
      prompt:
        completion.choices[0].message.content
    });

  } catch (error: any) {
  console.error(error);

  return Response.json(
    {
      error: error?.message || String(error),
    },
    { status: 500 }
  );
}
}

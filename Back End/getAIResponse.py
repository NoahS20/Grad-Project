from openai import OpenAI

client = OpenAI(
    organization='Towson',
    project='$PROJECT_ID'
)

def send_request(question):
    stream = client.chat.completions.create(
        model="gpt-3.5-turbo",
        messages=[{"role": "user", "content": question}],
        stream=True
    )
    for chunk in stream:
        if chunk.choices[0].delta.content is not None:
            print(chunk.choices[0].delta.content, end="")
    return question
from openai import OpenAI

client = OpenAI(
    
)

def send_request(questions):
    response = ""
    stream = client.chat.completions.create(
        model="gpt-3.5-turbo",
        messages=[{"role": "user", "content": questions}],
        stream=True
    )
    for chunk in stream:
        if chunk.choices[0].delta.content is not None:
            response = response + chunk.choices[0].delta.content
            #print(chunk.choices[0].delta.content, end="")
    response = response.rstrip('\n')
    return response

#print(send_request("What is 2+2? What is 4+4?"))
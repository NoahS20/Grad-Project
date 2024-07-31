import os
import replicate

def askLlama3(user_input, ai_input, questions):
    formatted_content = ""
    api = replicate.Client(api_token=os.environ["REPLICATE_API_TOKEN"])
    content = api.run(
        "meta/meta-llama-3-70b-instruct",
        input={
            "top_k": 0,
            "top_p": 0.95,
            "prompt": "Please determine if the two answers are similar from the following question(s), give a confidence score between 0 and 1 of the similarity, bullet point what is similar, and explain why. Take into account the length, similar language, and words used. Please say if the first answer is ChatGPT generated or not: The question is " + questions + "The first answer is the following: 1." + user_input + " That is the end of the first answer. The second answer is the following: 2." + ai_input + " That is the end of both answers. Please make the comparison and be concise. Do not say second answer. Instead say ChatGPT and submitted answer",
            "temperature": 0.75,
            "max_tokens": 512,
            "temperature": 0.7,
            "system_prompt": "You are a someone who is comparing two texts",
            "length_penalty": 1,
            "max_new_tokens": 512,
            "stop_sequences": "<|end_of_text|>,<|eot_id|>",
            "prompt_template": "<|begin_of_text|><|start_header_id|>system<|end_header_id|>\n\n{system_prompt}<|eot_id|><|start_header_id|>user<|end_header_id|>\n\n{prompt}<|eot_id|><|start_header_id|>assistant<|end_header_id|>\n\n",
            "presence_penalty": 0,
            "log_performance_metrics": False
        },
    )
    for contents in content:
        formatted_content = formatted_content + contents
    print(formatted_content)
    return formatted_content
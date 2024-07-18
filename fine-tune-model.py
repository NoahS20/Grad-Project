import json
import pandas as pd
from transformers import LlamaTokenizer, LlamaForSequenceClassification, Trainer, TrainingArguments
from torch.utils.data import Dataset
import torch
import torch.nn.functional as F

device = torch.device("cuda" if torch.cuda.is_available() else "cpu")

class TextPairDataset(Dataset):
    def __init__(self, jsonl_file):
        self.data = []
        with open(jsonl_file, 'r') as f:
            for line in f:
                self.data.append(json.loads(line))
        self.tokenizer = LlamaTokenizer.from_pretrained('meta-llama/Meta-Llama-3-8B')

    def __len__(self):
        return len(self.data)

    def __getitem__(self, idx):
        text1 = self.data[idx]['text1']
        text2 = self.data[idx]['text2']
        label = self.data[idx]['label']

        inputs1 = self.tokenizer(text1, return_tensors='pt', padding='max_length', truncation=True, max_length=128)
        inputs2 = self.tokenizer(text2, return_tensors='pt', padding='max_length', truncation=True, max_length=128)

        input_ids = torch.cat([inputs1['input_ids'], inputs2['input_ids']], dim=1)
        attention_mask = torch.cat([inputs1['attention_mask'], inputs2['attention_mask']], dim=1)

        return {'input_ids': input_ids.flatten(), 'attention_mask': attention_mask.flatten(), 'labels': torch.tensor(label)}
    
def compute_similarity_and_reasoning(model, tokenizer, prompt, text1, text2):
    prompt_text1 = f"{prompt} {text1}"
    prompt_text2 = f"{prompt} {text2}"
    
    inputs1 = tokenizer(prompt_text1, return_tensors='pt', padding='max_length', truncation=True, max_length=128).to(device)
    inputs2 = tokenizer(prompt_text2, return_tensors='pt', padding='max_length', truncation=True, max_length=128).to(device)

    with torch.no_grad():
        outputs1 = model(**inputs1).logits
        outputs2 = model(**inputs2).logits
        
    # Apply temperature scaling (temperature=0) to logits
    outputs1 = outputs1 / 1e-6  # To avoid division by zero
    outputs2 = outputs2 / 1e-6

    # Calculate similarity score using cosine similarity
    similarity_score = F.cosine_similarity(outputs1, outputs2).item()

    # Generate reasoning based on the logits
    reasoning = "The model considers the texts to be "
    if similarity_score > 0.7:
        reasoning += "AI generated"
    elif similarity_score < 0.7 and similarity_score > 0.49:
        reasoning += "Inconclusive"
    else:
        reasoning += "Human generated."

    return similarity_score, reasoning

def main():
    # Load dataset
    train_dataset = TextPairDataset('/content/drive/MyDrive/Colab Notebooks/Datasets/train-qar.jsonl')
    eval_dataset = TextPairDataset('/content/drive/MyDrive/Colab Notebooks/Datasets/val-qar.jsonl')

    # Load model and tokenizer
    tokenizer = LlamaTokenizer.from_pretrained('meta-llama/Meta-Llama-3-8B')
    model = LlamaForSequenceClassification.from_pretrained('meta-llama/Meta-Llama-3-8B', num_labels=3)
    model.to(device)

    # Define training arguments
    training_args = TrainingArguments(
        output_dir='./results',
        num_train_epochs=5000,
        per_device_train_batch_size=16,
        per_device_eval_batch_size=16,
        warmup_steps=500,
        weight_decay=0.01,
        logging_dir='./logs',
        logging_steps=10,
        save_strategy="epoch",  # Save checkpoint at end of each epoch
    )

    # Define trainer
    trainer = Trainer(
        model=model,
        args=training_args,
        train_dataset=train_dataset,
        eval_dataset=eval_dataset,
    )

    # Train the model
    trainer.train()

    # Evaluate the model
    results = trainer.evaluate()
    print(results)

    # Save the final model
    model.save_pretrained('./Save Pretrained Model and Tokenizer/final_model').to(device)
    tokenizer.save_pretrained('./Save Pretrained Model and Tokenizer/final_model_tokenizer')

def utilize_model(model, tokenizer, prompt_question, ai_text, user_text):
    # Example similarity check
    prompt = "Compare these texts based on their relevance to the following question: " + prompt_question
    ai_text = "The cat sat."
    user_text = "A cat was sitting."
    tokenizer = LlamaTokenizer.from_pretrained('./Save Pretrained Model and Tokenizer/final_model')
    model = LlamaForSequenceClassification.from_pretrained('./Save Pretrained Model and Tokenizer/final_model_tokenizer')
    score, reason = compute_similarity_and_reasoning(model, tokenizer, prompt, ai_text, user_text)
    print(f"Similarity score: {score}")
    print(f"Reasoning: {reason}")

if __name__ == "__main__":
    main()

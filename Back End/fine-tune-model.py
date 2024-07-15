import pandas as pd
from transformers import LLaMATokenizer, LLaMAForSequenceClassification, Trainer, TrainingArguments
from torch.utils.data import Dataset
import torch
import torch.nn.functional as F
import random

class TextPairDataset(Dataset):
    def __init__(self, csv_file, prompts):
        self.df = pd.read_csv(csv_file)
        self.tokenizer = LLaMATokenizer.from_pretrained('llama3-base')
        self.prompts = prompts
    
    def __len__(self):
        return len(self.df)
    
    def __getitem__(self, idx):
        text1 = self.df.iloc[idx, 0]
        text2 = self.df.iloc[idx, 1]
        label = self.df.iloc[idx, 2]

        # Select a random prompt from the list
        prompt = random.choice(self.prompts)
        
        prompt_text1 = f"{prompt} {text1}"
        prompt_text2 = f"{prompt} {text2}"
        
        inputs1 = self.tokenizer(prompt_text1, return_tensors='pt', padding='max_length', truncation=True, max_length=128)
        inputs2 = self.tokenizer(prompt_text2, return_tensors='pt', padding='max_length', truncation=True, max_length=128)
        
        input_ids = torch.cat([inputs1['input_ids'], inputs2['input_ids']], dim=1)
        attention_mask = torch.cat([inputs1['attention_mask'], inputs2['attention_mask']], dim=1)
        
        return {'input_ids': input_ids.flatten(), 'attention_mask': attention_mask.flatten(), 'labels': torch.tensor(label)}

def compute_similarity_and_reasoning(model, tokenizer, prompts, text1, text2):
    prompt = random.choice(prompts)
    prompt_text1 = f"{prompt} {text1}"
    prompt_text2 = f"{prompt} {text2}"
    
    inputs1 = tokenizer(prompt_text1, return_tensors='pt', padding='max_length', truncation=True, max_length=128)
    inputs2 = tokenizer(prompt_text2, return_tensors='pt', padding='max_length', truncation=True, max_length=128)

    with torch.no_grad():
        outputs1 = model(**inputs1).logits
        outputs2 = model(**inputs2).logits

    # Calculate similarity score using cosine similarity
    similarity_score = F.cosine_similarity(outputs1, outputs2).item()

    # Generate reasoning based on the logits
    reasoning = "The model considers the texts to be "
    if similarity_score > 0.5:
        reasoning += "similar."
    else:
        reasoning += "not similar."

    return similarity_score, reasoning

def main():
    # List of prompts
    prompts = [
        "Compare these texts based on their relevance to the following question: 'How do they describe a cat's behavior?'",
        "Compare these texts based on their emotional tone.",
        "Compare these texts based on their descriptive details.",
        "Compare these texts based on their informativeness about a given topic.",
        "Compare these texts based on their clarity and conciseness."
    ]
    
    # Load dataset
    train_dataset = TextPairDataset('train_text_pairs.csv', prompts)
    eval_dataset = TextPairDataset('eval_text_pairs.csv', prompts)
    
    # Load model and tokenizer
    tokenizer = LLaMATokenizer.from_pretrained('llama3-base')
    model = LLaMAForSequenceClassification.from_pretrained('llama3-base', num_labels=2)
    
    # Define training arguments
    training_args = TrainingArguments(
        output_dir='./results',
        num_train_epochs=3,
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
    model.save_pretrained('./Save Pretrained Model and Tokenizer/final_model')
    tokenizer.save_pretrained('./Save Pretrained Model and Tokenizer/final_model_tokenizer')

def utilize_model(model, tokenizer, prompt, ai_text, user_text):
    # Example similarity check
    ai_text = "The cat sat."
    user_text = "A cat was sitting."
    score, reason = compute_similarity_and_reasoning(model, tokenizer, prompt, ai_text, user_text)
    print(f"Similarity score: {score}")
    print(f"Reasoning: {reason}")

if __name__ == "__main__":
    main()

from openai import OpenAI
from dotenv import load_dotenv
import os

load_dotenv()
key = os.getenv('OPENAI_API_KEY')

client = OpenAI(
    api_key= key,
)

def get_personality_question():
    """Generate a personality-related question"""
    prompt = "You are a reverse fortune teller. Instead of predicting the future, you ask personality-related questions to understand the person. Generate an interesting question."
    
    response = client.chat.completions.create(
        messages=[
            {
                "role": "system",
                "content": prompt
            }
        ],
        model="gpt-4o-mini",
    )
    
    response_message = response.choices[0].message.content
    
    return response_message

def generate_story(answer):
    """Generate a vague but relatable story based on the user's personality answer"""
    prompt = f"The user's answer to this question is : {answer}. Formulate a reverse fortune statement  of no more than 3 lines, based on the answer the user has given and make the reverse fortune statement very accurate, unsettling that plays on the human tendency to fill in the blanks with personal experiences. The answer will make the user question how does it know? The reverse fortune statement should also be a little dark and humorous at the same time but no racism or sexism or religious jokes. Make the reverse fortune statement very personal to the user's (past love life or age or relationship with others or primary education or sports), so that, the user can relate to it. And make the reverse fortune statement funny"

    response = client.chat.completions.create(
        messages=[
            {
                "role": "system",
                "content": prompt
            }
        ],
        model="gpt-4o-mini",
    )

    response_message = response.choices[0].message.content
    
    return response_message

def main():
    print("🔮 Welcome to the Reverse Fortune Teller! 🔮")
    
    # Ask one personality question
    question = get_personality_question()
    print("\n" + question)
    answer = input("Your answer: ")
    
    # Generate a vague but intriguing story
    story = generate_story(answer)
    print(story)

if __name__ == "__main__":
    main()
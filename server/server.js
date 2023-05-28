import os
import openai
from flask import Flask, request, jsonify

app = Flask(__name__)
openai.api_key = os.getenv("OPENAI_API_KEY")

start_sequence = "\nAI:"
restart_sequence = "\nHuman: "

@app.route('/', methods=['GET'])
def hello():
    return jsonify({'message': 'Hello from CodeX!'})

@app.route('/', methods=['POST'])
def chat():
    try:
        prompt = request.json['prompt']
        conversation_context = request.json.get('context')
        
        if conversation_context:
            prompt = conversation_context + restart_sequence + prompt
        
        response = openai.Completion.create(
            model="text-davinci-003",
            prompt=prompt,
            temperature=0.9,
            max_tokens=3000,
            top_p=1,
            frequency_penalty=0.5,
            presence_penalty=0,
            stop=[" Human:", " AI:"]
        )
        
        choices = response.choices[0]
        conversation_context = choices['context'] if 'context' in choices else None
        bot_response = choices['text']
        
        return jsonify({'bot': bot_response, 'context': conversation_context})
    except Exception as e:
        print(e)
        return jsonify({'error': 'Something went wrong'}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)

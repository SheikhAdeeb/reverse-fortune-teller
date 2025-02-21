from flask import Flask, request, jsonify
from flask_cors import CORS
from reverse import get_personality_question, generate_story  
app = Flask(__name__)
CORS(app)

# Endpoint to fetch a personality question
@app.route('/question', methods=['GET'])
def question():
    q = get_personality_question()
    return jsonify({"question": q})

# Endpoint to generate the reverse fortune story
@app.route('/fortune', methods=['POST'])
def fortune():
    data = request.get_json()
    user_answer = data.get("user_answer")
    if not user_answer:
        return jsonify({"error": "No user_answer provided"}), 400
    story = generate_story(user_answer)
    return jsonify({"story": story})

if __name__ == '__main__':
    app.run(debug=True)
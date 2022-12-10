from flask import Flask, request, jsonify
from spacy.pipeline import EntityRecognizer
from flask_cors import CORS
import spacy
app = Flask(__name__)

cors = CORS()

nlp = spacy.load("en_core_web_sm")



print("Loaded")


@app.route("/tasks/NER", methods=["POST"])
def nerRoute():
    data = request.json["data"]
    print(data)

    for file in data:
        text = file["file"]["text"]
        doc = nlp(text)
        for ent in doc.ents:
            print(ent.text, ent.label_)



    return data



app.run("localhost","5000", debug=True)
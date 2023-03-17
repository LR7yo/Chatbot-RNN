# Importing libraries into the project

from flask import Flask, jsonify, request
import tensorflow as tf
import pandas as pd
import numpy as np
import json
from keras.preprocessing.text import Tokenizer
from keras.preprocessing.text import Tokenizer
from keras.utils import pad_sequences
from sklearn.preprocessing import LabelEncoder
import random
import string

# Creating the flask app

app = Flask(__name__)

# Creating the predict function

@app.route('/predict', methods=['POST'])
def predict():

    # Loading the dataset into the function

    with open(r"C:\Users\likhi\OneDrive - DPSI School\Desktop\Projects\Chatbot 2\Machine_Learning\Intent.json") as chatbot_dataset:
      dataset = json.load(chatbot_dataset)

    # Processing the dataset classes

    def processing_json_dataset(dataset):
      tags = []
      inputs = []
      responses={}
      for intent in dataset['intents']:
          responses[intent['intent']]=intent['responses']
          for lines in intent['text']:

              # Apply pre-processing steps to the input text

              preprocessed_lines = lines.lower()
              preprocessed_lines = ''.join([c for c in preprocessed_lines if c not in string.punctuation])
              inputs.append(preprocessed_lines)
              tags.append(intent['intent'])
      return [tags, inputs, responses]

    [tags, inputs, responses] = processing_json_dataset(dataset)

    # Creating a Pandas DataFrame for the inputs and tags from the dataset

    dataset = pd.DataFrame({"inputs":inputs,
                         "tags":tags})

    dataset = dataset.sample(frac=1)

    # Changing all the characters to lowercase except punctuation

    dataset['inputs'] = dataset['inputs'].apply(lambda sequence:
                                                [ltrs.lower() for ltrs in sequence if ltrs not in string.punctuation])

    dataset['inputs'] = dataset['inputs'].apply(lambda wrd: ''.join(wrd))

    # Initializing and fitting the Tokenizer onto the input and tag classes

    tokenizer = Tokenizer(num_words=1000)
    tokenizer.fit_on_texts(dataset['inputs'])
    train = tokenizer.texts_to_sequences(dataset['inputs'])
    features = pad_sequences(train)
    le = LabelEncoder()
    labels = le.fit_transform(dataset['tags'])

    #Defining the input shape

    input_shape = features.shape[1]

    vocabulary = len(tokenizer.word_index)
    output_length = le.classes_.shape[0]

    # Loading the RNN model

    model=tf.keras.models.load_model(r"C:\Users\likhi\OneDrive - DPSI School\Desktop\Projects\Chatbot 2\Machine_Learning\chatbot_model.h5")

    #Loading the training material for embedding layer

    glove_dir = r"C:\Users\likhi\OneDrive - DPSI School\Desktop\Projects\Chatbot 2\Machine_Learning\glove.6B.100d.txt"
    embeddings_index = {}
    file_ = open(glove_dir, encoding='utf8')
    for line in file_:
        arr = line.split()
        single_word = arr[0]
        w = np.asarray(arr[1:],dtype='float32')
        embeddings_index[single_word] = w
    file_.close()

    #Creating the embedding matrix

    max_words = vocabulary + 1
    word_index = tokenizer.word_index
    embedding_matrix = np.zeros((max_words,100)).astype(object)
    for word , i in word_index.items():
            embedding_vector = embeddings_index.get(word)
            if embedding_vector is not None:
                embedding_matrix[i] = embedding_vector

    #Applying the embedding matrix as the weights of the embedding layer in the model

    model.layers[0].set_weights([embedding_matrix])
    model.layers[0].trainable = False

    model.compile(loss="sparse_categorical_crossentropy",optimizer='adam',metrics=['accuracy'])

    # Creating the generate answer function

    def generate_answer(query):
      texts = []
      pred_input = query['input_text']
      pred_input = [letters.lower() for letters in pred_input if letters not in string.punctuation]
      pred_input = ''.join(pred_input)
      texts.append(pred_input)
      pred_input = tokenizer.texts_to_sequences(texts)
      pred_input = np.array(pred_input).reshape(-1)
      pred_input = pad_sequences([pred_input],input_shape)

      # Predicting the output from the input via model
      
      output = model.predict(pred_input)
      output = output.argmax()
      response_tag = le.inverse_transform([output])[0]
      return random.choice(responses[response_tag])

    # Getting the input from the json file and applying the output function onto it

    x=request.get_json()
    response=generate_answer(x)
    print(response)

    # Converting the output into JSON format

    return jsonify({'response': response})

# Running the application

if __name__ == '__main__':
    app.run(debug=True)
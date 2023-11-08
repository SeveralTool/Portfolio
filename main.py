import json
import random

def passGenerator():
    letrasMin = "abcdefghijklmnopqrstuvwxyz" # Definimos letras en minuscula
    letrasMay = "ABCDEFGHIJKLMNOPQRSTUVWXYZ" # Definimos letras en mayuscula
    nums = "1234567890" # Definimos numeros
    symbols = "$%&/@#" # Definimos algunos simbolos
    length = 32 # Establecemos el tamaño de la pass

    combinacion = letrasMin + letrasMay + nums + symbols # Creamos la combinacion de la creacion

    password = "".join(random.sample(combinacion, length)) # Usamos random y conmbinamos aleatoriamente con el tamaño max
    # print(password) # Imprimimos la password

    `print(json.dumps({"password": password}))`


passGenerator()


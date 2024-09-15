"""

Run this script when updating the words.txt. Do not update the json file directly (I mean you could, but just listen to me lol).

"""

letters = 5

with open (f'{letters}_letter_words.txt') as file:
    words = file.readlines()

with open (f'{letters}_letter_words.json', 'w') as new_file:
    words_length = len(words)
    new_file.write('[')

    for line in words[:words_length]:
        line = line.upper()
        new_file.write(f'\n\t"{line.strip()}",')
    new_file.write(f'\n\t"{line.strip()}"')

    new_file.write('\n]')
from http.server import BaseHTTPRequestHandler
import json
import random
import pandas as pd


class handler(BaseHTTPRequestHandler):

    def do_POST(self):
        self.send_response(200)
        self.send_header('Content-type', 'text/plain')
        self.end_headers()
        content_len = int(self.headers.get('Content-Length'))
        params = json.loads(self.rfile.read(content_len))
        puzzle_info = self.create_puzzle(params)
        self.wfile.write(json.dumps(puzzle_info).encode())

    @staticmethod
    def create_puzzle(params):
        '''
        params: 
        - usedIDs: list of used puzzle IDs (1-1362)
        - difficulty: list of difficulties (0-3)
        - randomness: bool for whether or not to randomly insert other difficulties
        '''
        # easy, medium, hard, extreme (0%, 25%, 60%, 90%)
        difficulty_idxs = [1, 341, 817, 1226, 1363]  # i->i+1 for difficulty i
        df = pd.read_csv('api/24_difficulties.csv', index_col=0)

        used = set(params['usedIDs'])
        difficulty = params['difficulty']
        randomness = params['randomness']
        available = set(
            range(difficulty_idxs[difficulty], difficulty_idxs[difficulty + 1])) - used

        # with 10% chance, pick random puzzle
        if randomness and random.random() < 0.2:
            puzzle_idx = random.choice(list(set(range(1, 1363)) - used))
        else:
            puzzle_idx = random.choice(list(available))

        four_nums = list(map(int, df['Puzzles'].iloc[puzzle_idx-1].split()))

        return {'puzzleID': puzzle_idx, 'gameNums': four_nums}


if __name__ == '__main__':
    print(handler.create_puzzle({'usedIDs': [5],
                                 'difficulty': 3, 'randomness': True}))

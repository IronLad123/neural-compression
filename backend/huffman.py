import heapq
from collections import Counter
import pickle

# ---------- Tree node ----------
class Node:
    def __init__(self, freq, symbol=None, left=None, right=None):
        self.freq = freq
        self.symbol = symbol
        self.left = left
        self.right = right

    def __lt__(self, other):
        return self.freq < other.freq


# ---------- Build tree ----------
def build_tree(data):
    freq = Counter(data)
    heap = [Node(f, s) for s, f in freq.items()]
    heapq.heapify(heap)

    while len(heap) > 1:
        a = heapq.heappop(heap)
        b = heapq.heappop(heap)
        heapq.heappush(heap, Node(a.freq + b.freq, None, a, b))

    return heap[0]


# ---------- Build codes ----------
def build_codes(node, prefix="", table=None):
    if table is None:
        table = {}
    if node.symbol is not None:
        table[node.symbol] = prefix
        return table
    build_codes(node.left, prefix + "0", table)
    build_codes(node.right, prefix + "1", table)
    return table


# ---------- Encode ----------
def encode_bytes(data, outfile):
    tree = build_tree(data)
    codes = build_codes(tree, "")

    bitstring = "".join(codes[b] for b in data)

    padding = 8 - len(bitstring) % 8
    bitstring += "0" * padding

    byte_array = bytearray()
    for i in range(0, len(bitstring), 8):
        byte_array.append(int(bitstring[i:i+8], 2))

    with open(outfile, "wb") as f:
        pickle.dump((tree, padding), f)
        f.write(byte_array)


# ---------- Decode ----------
def decode_bytes(infile):
    with open(infile, "rb") as f:
        tree, padding = pickle.load(f)
        data = f.read()

    bitstring = "".join(f"{byte:08b}" for byte in data)
    bitstring = bitstring[:-padding]

    out = []
    node = tree
    for bit in bitstring:
        node = node.left if bit == "0" else node.right
        if node.symbol is not None:
            out.append(node.symbol)
            node = tree

    return bytes(out)


def delta_encode(data):
    out = bytearray()
    prev = 0
    for b in data:
        diff = (b - prev) % 256
        out.append(diff)
        prev = b
    return bytes(out)


def delta_decode(data):
    out = bytearray()
    prev = 0
    for b in data:
        val = (prev + b) % 256
        out.append(val)
        prev = val
    return bytes(out)

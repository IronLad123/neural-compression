import sys, os
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

import torch
import matplotlib.pyplot as plt
from PIL import Image
from torchvision import transforms
from model.autoencoder import Autoencoder


device = "cpu"

model = Autoencoder().to(device)
root = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
model.load_state_dict(torch.load(os.path.join(root, "model.pth"), map_location=device))

model.eval()

img = Image.open("sample.png").convert("RGB")

transform = transforms.Compose([
    transforms.Resize((128,128)),
    transforms.ToTensor()
])

x = transform(img).unsqueeze(0).to(device)

with torch.no_grad():
    latent = model.encoder(x)[0]  # remove batch

# show first 16 channels
fig, axes = plt.subplots(4,4, figsize=(6,6))

for i in range(16):
    ax = axes[i//4, i%4]
    ax.imshow(latent[i].cpu(), cmap='gray')
    ax.axis("off")

plt.tight_layout()
plt.savefig("results/latent_maps.png")
print("Saved results/latent_maps.png")

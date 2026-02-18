import sys, os
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

import torch
from PIL import Image
from torchvision import transforms
from model.autoencoder import Autoencoder

device = "cuda" if torch.cuda.is_available() else "cpu"

# load model
model = Autoencoder().to(device)
model.load_state_dict(torch.load("model.pth", map_location=device))
model.eval()

# image transform
transform = transforms.Compose([
    transforms.Resize((128,128)),
    transforms.ToTensor()
])

# choose any image (put one jpg/png in project root)
img = Image.open("sample.png").convert("RGB")
x = transform(img).unsqueeze(0).to(device)

with torch.no_grad():
    recon = model(x)

# save reconstructed image
out = recon.squeeze().cpu()
out_img = transforms.ToPILImage()(out)
out_img.save("reconstructed.png")

print("Reconstructed image saved")

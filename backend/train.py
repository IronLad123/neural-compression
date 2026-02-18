import sys, os
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

import torch
import torch.nn as nn
from model.autoencoder import Autoencoder
from backend.dataloader import get_loader

def main():

    device = "cuda" if torch.cuda.is_available() else "cpu"
    print("Device:", device)

    model = Autoencoder().to(device)
    optimizer = torch.optim.Adam(model.parameters(), lr=1e-3)
    criterion = nn.MSELoss()

    loader = get_loader()

    print("Starting training...")

    for epoch in range(25):
        total_loss = 0

        for imgs, _ in loader:
            imgs = imgs.to(device)

            recon = model(imgs)
            loss = criterion(recon, imgs)

            optimizer.zero_grad()
            loss.backward()
            optimizer.step()

            total_loss += loss.item()

        print(f"Epoch {epoch+1}: {total_loss/len(loader):.4f}")

    torch.save(model.state_dict(), "model.pth")
    print("Model saved")

if __name__ == "__main__":
    main()

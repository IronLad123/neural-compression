import torch
import torch.nn as nn

# -------- Encoder --------
class Encoder(nn.Module):
    def __init__(self):
        super().__init__()
        self.net = nn.Sequential(

           nn.Conv2d(3, 32, 4, 2, 1),   # 128 → 64
nn.ReLU(),

nn.Conv2d(32, 64, 4, 2, 1),  # 64 → 32
nn.ReLU(),

nn.Conv2d(64, 64, 4, 2, 1),  # 32 → 16
nn.ReLU(),

nn.Conv2d(64, 64, 3, 1, 1),  # bottleneck 16×16
nn.ReLU()

        )

    def forward(self, x):
        return self.net(x)


# -------- Decoder --------
class Decoder(nn.Module):
    def __init__(self):
        super().__init__()
        self.net = nn.Sequential(

          nn.Conv2d(64, 64, 3, 1, 1),
nn.ReLU(),

nn.ConvTranspose2d(64, 64, 4, 2, 1),  # 16 → 32
nn.ReLU(),

nn.ConvTranspose2d(64, 32, 4, 2, 1),  # 32 → 64
nn.ReLU(),

nn.ConvTranspose2d(32, 3, 4, 2, 1),   # 64 → 128
nn.Sigmoid()

        )

    def forward(self, x):
        return self.net(x)


class Autoencoder(nn.Module):
    def __init__(self):
        super().__init__()
        self.encoder = Encoder()
        self.decoder = Decoder()

    def forward(self, x):
        z = self.encoder(x)
        return self.decoder(z)

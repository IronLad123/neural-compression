import matplotlib.pyplot as plt

# size in KB
sizes = [353, 396, 562, 868, 1177]

# psnr values
psnr = [8.99, 14.32, 22.23, 28.43, 31.76]

levels = [2,4,8,16,32]

plt.plot(sizes, psnr, marker='o')
for i, lvl in enumerate(levels):
    plt.text(sizes[i], psnr[i], f"L{lvl}")

plt.xlabel("Compressed Size (KB)")
plt.ylabel("PSNR (dB)")
plt.title("Neural Compression Quality vs Size")
plt.grid(True)

plt.savefig("results/quality_vs_size.png", dpi=300)
print("Graph saved in results/quality_vs_size.png")

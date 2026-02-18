export default function About() {
  return (
    <div className="page">
      <section className="panel" data-label="Overview">
        <div className="panel-title">
          <div>
            <h2>Project Overview</h2>
            <p>Neural image compression pipeline with scientific evaluation.</p>
          </div>
        </div>
        <p className="about-lede">
          This system compresses images using a trained autoencoder and evaluates
          reconstruction quality with objective metrics. It is designed for
          reproducible experiments with measurable outputs, standardized artifacts,
          and batch processing support.
        </p>
      </section>

      <div className="about-grid">
        <section className="panel" data-label="Aim">
          <div className="panel-title">
            <div>
              <h2>Aim</h2>
              <p>Clear objectives and measurable outcomes.</p>
            </div>
          </div>
          <ul className="about-list">
            <li>Reduce image size while preserving structure and detail.</li>
            <li>Quantify quality using PSNR, SSIM, BPP, and compression ratio.</li>
            <li>Expose artifacts for reproducibility and audit.</li>
            <li>Enable deterministic batch processing and comparisons.</li>
          </ul>
        </section>

        <section className="panel" data-label="Model">
          <div className="panel-title">
            <div>
              <h2>Model</h2>
              <p>Autoencoder-based compression engine.</p>
            </div>
          </div>
          <div className="about-specs">
            <div>
              <span>Architecture</span>
              <strong>Convolutional autoencoder</strong>
            </div>
            <div>
              <span>Latent shape</span>
              <strong>64 × 16 × 16</strong>
            </div>
            <div>
              <span>Patch size</span>
              <strong>128 × 128</strong>
            </div>
            <div>
              <span>Decoder</span>
              <strong>Transposed convolution stack</strong>
            </div>
          </div>
          <p className="about-note">
            The model weights are fixed and used for encoding and decoding; training
            is not part of the runtime pipeline.
          </p>
          <div className="nn-visual">
            <div className="nn-column">
              <span className="nn-label">Input</span>
              <div className="nn-node" />
              <div className="nn-node" />
              <div className="nn-node" />
            </div>
            <div className="nn-column">
              <span className="nn-label">Encoder</span>
              <div className="nn-node nn-node-wide" />
              <div className="nn-node nn-node-wide" />
              <div className="nn-node nn-node-wide" />
              <div className="nn-node nn-node-wide" />
            </div>
            <div className="nn-column">
              <span className="nn-label">Latent</span>
              <div className="nn-node nn-node-accent" />
              <div className="nn-node nn-node-accent" />
            </div>
            <div className="nn-column">
              <span className="nn-label">Decoder</span>
              <div className="nn-node nn-node-wide" />
              <div className="nn-node nn-node-wide" />
              <div className="nn-node nn-node-wide" />
              <div className="nn-node nn-node-wide" />
            </div>
            <div className="nn-column">
              <span className="nn-label">Output</span>
              <div className="nn-node" />
              <div className="nn-node" />
              <div className="nn-node" />
            </div>
          </div>
        </section>
      </div>

      <section className="panel" data-label="Pipeline">
        <div className="panel-title">
          <div>
            <h2>Compression Pipeline</h2>
            <p>End-to-end steps from input to reconstruction.</p>
          </div>
        </div>
        <div className="about-flow">
          <div className="flow-step">
            <span>1</span>
            <div>
              <strong>Encode</strong>
              <p>Image patches are encoded into latent tensors.</p>
            </div>
          </div>
          <div className="flow-step">
            <span>2</span>
            <div>
              <strong>Quantize</strong>
              <p>Latents are scaled to discrete levels (quality parameter).</p>
            </div>
          </div>
          <div className="flow-step">
            <span>3</span>
            <div>
              <strong>Entropy Encode</strong>
              <p>Delta + Huffman coding reduces size of latent bytes.</p>
            </div>
          </div>
          <div className="flow-step">
            <span>4</span>
            <div>
              <strong>Decode</strong>
              <p>Latents are reconstructed into image patches.</p>
            </div>
          </div>
        </div>
      </section>

      <div className="about-grid">
        <section className="panel" data-label="Inputs / Outputs">
          <div className="panel-title">
            <div>
              <h2>Inputs & Outputs</h2>
              <p>What the system accepts and produces.</p>
            </div>
          </div>
          <ul className="about-list">
            <li>Input: RGB image files (PNG/JPG).</li>
            <li>Output: reconstructed PNG image.</li>
            <li>Artifacts: latents, scales, and shape files.</li>
            <li>Metadata: compression ratio, BPP, PSNR, SSIM.</li>
          </ul>
        </section>

        <section className="panel" data-label="Evaluation">
          <div className="panel-title">
            <div>
              <h2>Evaluation</h2>
              <p>Metrics used for scientific comparison.</p>
            </div>
          </div>
          <ul className="about-list">
            <li>PSNR and SSIM quantify reconstruction fidelity.</li>
            <li>BPP measures compressed bits per pixel.</li>
            <li>Compression ratio compares original vs compressed size.</li>
          </ul>
        </section>
      </div>

      <section className="panel" data-label="Terms & Metrics">
        <div className="panel-title">
          <div>
            <h2>Terms & Metrics (with examples)</h2>
            <p>Definitions used throughout the dashboard.</p>
          </div>
        </div>
        <div className="terms-grid">
          <div className="term-card">
            <h3>Compression ratio</h3>
            <p>How many times smaller the compressed file is.</p>
            <div className="term-example">
              Example: 2,097,152 bytes original / 262,144 bytes compressed = 8.0×
            </div>
          </div>
          <div className="term-card">
            <h3>BPP (bits per pixel)</h3>
            <p>Compressed size in bits divided by total pixels.</p>
            <div className="term-example">
              Example: 262,144 bytes × 8 / 1024×1024 pixels ≈ 2.0 bpp
            </div>
          </div>
          <div className="term-card">
            <h3>PSNR (dB)</h3>
            <p>Log-scale error metric; higher is better.</p>
            <div className="term-example">
              Example: 30 dB indicates good fidelity; 20 dB is low.
            </div>
          </div>
          <div className="term-card">
            <h3>SSIM</h3>
            <p>Structural similarity in [0, 1]; higher is better.</p>
            <div className="term-example">
              Example: 0.95 is high similarity; 0.60 indicates visible loss.
            </div>
          </div>
        </div>
      </section>

      <section className="panel" data-label="Limitations">
        <div className="panel-title">
          <div>
            <h2>Limitations</h2>
            <p>Known constraints and scope of use.</p>
          </div>
        </div>
        <ul className="about-list">
          <li>Performance depends on the fixed model weights.</li>
          <li>Quality varies with compression level and image content.</li>
          <li>Patch-based processing can introduce seams on some inputs.</li>
        </ul>
      </section>

      <section className="panel" data-label="Contact">
        <div className="panel-title">
          <div>
            <h2>Project Contact</h2>
            <p>Primary maintainer and coordination.</p>
          </div>
        </div>
        <div className="about-specs">
          <div>
            <span>Name</span>
            <strong>Om Srivastava</strong>
          </div>
          <div>
            <span>Email</span>
            <strong>srivastavaom078@gmail.com</strong>
          </div>
        </div>
      </section>
    </div>
  )
}

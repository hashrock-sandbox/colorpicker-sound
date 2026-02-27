import "./AboutPage.css";

interface Props {
  onBack: () => void;
}

export function AboutPage({ onBack }: Props) {
  return (
    <div className="about">
      <nav className="about-nav">
        <button className="about-back-btn" onClick={onBack}>
          ← Back
        </button>
      </nav>

      <h1>Color → Sound 変換ルール</h1>
      <p className="about-intro">
        このアプリでは、カラーホイール上の色を <strong>FM合成</strong>{" "}
        のパラメータに変換して音を生成しています。
        色の2つの要素——<strong>色相 (Hue)</strong> と{" "}
        <strong>明度 (Lightness)</strong>
        ——がそれぞれ異なる音響パラメータを制御します。
      </p>

      <section className="about-section">
        <h2>共通の仕組み</h2>

        <h3>カラーホイール</h3>
        <div className="about-diagram">
          <div className="wheel-diagram">
            <div className="wheel-outer">
              <span className="wheel-label-edge">外周: 鮮やか (L=50%)</span>
              <div className="wheel-inner">
                <span className="wheel-label-center">
                  中心: 白 (L=100%)
                </span>
              </div>
            </div>
          </div>
        </div>
        <ul>
          <li>
            <strong>角度</strong> → 色相 (Hue: 0°〜360°)
          </li>
          <li>
            <strong>中心からの距離</strong> → 明度 (Lightness: 50%〜100%)
          </li>
        </ul>

        <h3>FM合成 (Frequency Modulation)</h3>
        <p>
          キャリア (主音) にモジュレータ (変調器) を接続し、
          モジュレータの出力でキャリアの周波数を揺らすことで複雑な倍音を生成します。
        </p>
        <div className="fm-chain">
          <div className="fm-block fm-mod">Modulator</div>
          <div className="fm-arrow">→</div>
          <div className="fm-block fm-carrier">Carrier</div>
          <div className="fm-arrow">→</div>
          <div className="fm-block fm-out">Output</div>
        </div>
        <ul>
          <li>
            <strong>変調指数 (Index)</strong> — 大きいほど倍音が豊か。
            外周ほど高い値、中心ほど低い値
          </li>
          <li>
            <strong>比率 (Ratio)</strong> — 整数比は「調和的」、非整数比は「金属的・不協和」
          </li>
          <li>
            <strong>ADSR エンベロープ</strong> — Attack / Decay / Sustain /
            Release で音量の時間変化を制御
          </li>
        </ul>
      </section>

      <section className="about-section model-section">
        <h2>Model A: Messiaen</h2>
        <p className="model-subtitle">重層・発光・和声由来</p>
        <p>
          作曲家オリヴィエ・メシアンの色彩和声に着想を得たモデル。
          整数比のFM合成を用い、倍音が調和的に重なるステンドグラスのような響きを生みます。
        </p>

        <h3>色相 → 周波数</h3>
        <p>色相によってキャリア周波数 (基音) が滑らかに変化します。</p>
        <table>
          <thead>
            <tr>
              <th>色</th>
              <th>色相</th>
              <th>周波数</th>
              <th>音名</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                <span className="color-dot" style={{ background: "hsl(0,100%,50%)" }} />
                赤
              </td>
              <td>0°</td>
              <td>220 Hz</td>
              <td>A3</td>
            </tr>
            <tr>
              <td>
                <span className="color-dot" style={{ background: "hsl(30,100%,50%)" }} />
                橙
              </td>
              <td>30°</td>
              <td>277 Hz</td>
              <td>C#4</td>
            </tr>
            <tr>
              <td>
                <span className="color-dot" style={{ background: "hsl(60,100%,65%)" }} />
                黄
              </td>
              <td>60°</td>
              <td>440 Hz</td>
              <td>A4</td>
            </tr>
            <tr>
              <td>
                <span className="color-dot" style={{ background: "hsl(120,100%,40%)" }} />
                緑
              </td>
              <td>120°</td>
              <td>330 Hz</td>
              <td>E4</td>
            </tr>
            <tr>
              <td>
                <span className="color-dot" style={{ background: "hsl(240,100%,50%)" }} />
                青
              </td>
              <td>240°</td>
              <td>196 Hz</td>
              <td>G3</td>
            </tr>
            <tr>
              <td>
                <span className="color-dot" style={{ background: "hsl(270,100%,50%)" }} />
                紫
              </td>
              <td>270°</td>
              <td>262 Hz</td>
              <td>C4</td>
            </tr>
          </tbody>
        </table>
        <p className="table-note">
          アンカー間は線形補間で滑らかに繋がります。黄色が最も高く (440 Hz)、青が最も低い
          (196 Hz) という、明るさと音高の直感的な対応です。
        </p>

        <h3>色相 → 倍音構造</h3>
        <table>
          <thead>
            <tr>
              <th>色相領域</th>
              <th>Op2 比率</th>
              <th>Op3 比率</th>
              <th>効果</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>暖色系 (0°〜180°)</td>
              <td>2</td>
              <td>4</td>
              <td>シンプルで温かい倍音</td>
            </tr>
            <tr>
              <td>寒色系 (180°〜360°)</td>
              <td>3</td>
              <td>5</td>
              <td>複雑で透明感のある倍音</td>
            </tr>
          </tbody>
        </table>

        <h3>明度 → 音色の複雑さ</h3>
        <p>
          明度は「音の密度」を制御します。外周 (鮮やか) ほどリッチで複雑、中心 (白)
          ほどピュアでシンプルな音になります。
        </p>
        <table>
          <thead>
            <tr>
              <th>パラメータ</th>
              <th>外周 (L=50%)</th>
              <th>中心 (L=100%)</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>変調指数 (Op1)</td>
              <td>4.5</td>
              <td>1.5</td>
            </tr>
            <tr>
              <td>変調指数 (Op2)</td>
              <td>3.0</td>
              <td>1.0</td>
            </tr>
            <tr>
              <td>変調指数 (Op3)</td>
              <td>1.5</td>
              <td>0.3</td>
            </tr>
            <tr>
              <td>アタック</td>
              <td>0.03 秒 (素早い)</td>
              <td>0.15 秒 (ゆっくり)</td>
            </tr>
            <tr>
              <td>サスティン</td>
              <td>0.7</td>
              <td>0.4</td>
            </tr>
            <tr>
              <td>持続時間</td>
              <td>2.0 秒</td>
              <td>3.5 秒</td>
            </tr>
            <tr>
              <td>サブオシレータ</td>
              <td>ゲイン 0.2</td>
              <td>ゲイン 0.08</td>
            </tr>
          </tbody>
        </table>
        <p className="table-note">
          サブオシレータはキャリアの1オクターブ下で鳴り、音に温かみと厚みを加えます。
        </p>
      </section>

      <section className="about-section model-section">
        <h2>Model B: Kandinsky</h2>
        <p className="model-subtitle">方向性・鋭さ・空間</p>
        <p>
          画家ワシリー・カンディンスキーの「色は形と音を持つ」という理論に着想を得たモデル。
          非整数比のFM合成と波形の切り替えにより、幾何学的で鋭い空間的な響きを生みます。
        </p>

        <h3>色相 → 周波数</h3>
        <p>Messiaen よりも広い周波数レンジを使い、黄色と青の対比がより極端です。</p>
        <table>
          <thead>
            <tr>
              <th>色</th>
              <th>色相</th>
              <th>周波数</th>
              <th>特徴</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                <span className="color-dot" style={{ background: "hsl(0,100%,50%)" }} />
                赤
              </td>
              <td>0°</td>
              <td>330 Hz</td>
              <td>中域</td>
            </tr>
            <tr>
              <td>
                <span className="color-dot" style={{ background: "hsl(30,100%,50%)" }} />
                橙
              </td>
              <td>30°</td>
              <td>392 Hz</td>
              <td>やや高い</td>
            </tr>
            <tr>
              <td>
                <span className="color-dot" style={{ background: "hsl(60,100%,65%)" }} />
                黄
              </td>
              <td>60°</td>
              <td>880 Hz</td>
              <td>突き刺すような高音</td>
            </tr>
            <tr>
              <td>
                <span className="color-dot" style={{ background: "hsl(120,100%,40%)" }} />
                緑
              </td>
              <td>120°</td>
              <td>262 Hz</td>
              <td>落ち着いた中域</td>
            </tr>
            <tr>
              <td>
                <span className="color-dot" style={{ background: "hsl(240,100%,50%)" }} />
                青
              </td>
              <td>240°</td>
              <td>82 Hz</td>
              <td>深い低音</td>
            </tr>
            <tr>
              <td>
                <span className="color-dot" style={{ background: "hsl(270,100%,50%)" }} />
                紫
              </td>
              <td>270°</td>
              <td>311 Hz</td>
              <td>中域</td>
            </tr>
          </tbody>
        </table>
        <p className="table-note">
          黄色 (880 Hz) と青 (82 Hz) の差は約3.4オクターブ。
          カンディンスキーが描いた「黄色は鋭く攻撃的、青は深く内省的」という対比を反映しています。
        </p>

        <h3>色相 → 波形</h3>
        <p>
          Messiaen が常に Sine 波を使うのに対し、Kandinsky
          は色相領域ごとにキャリアの波形を切り替えます。
        </p>
        <table>
          <thead>
            <tr>
              <th>色相領域</th>
              <th>波形</th>
              <th>音の特徴</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>暖色 (0°〜90°, 300°〜360°)</td>
              <td>Sawtooth (鋸歯波)</td>
              <td>攻撃的で倍音が豊か</td>
            </tr>
            <tr>
              <td>緑系 (90°〜180°)</td>
              <td>Triangle (三角波)</td>
              <td>柔らかく丸みのある音</td>
            </tr>
            <tr>
              <td>寒色 (180°〜300°)</td>
              <td>Sine (正弦波)</td>
              <td>純粋でクリアな音</td>
            </tr>
          </tbody>
        </table>

        <h3>色相 → 非整数比率</h3>
        <p>
          Kandinsky モデルでは意図的に非整数比を使い、不協和で金属的な響きを作ります。
        </p>
        <table>
          <thead>
            <tr>
              <th>パラメータ</th>
              <th>値</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Op1 比率</td>
              <td>
                紫領域 (240°〜300°): √2 ≈ 1.414
                <br />
                その他: 1.5〜3.0 (色相に比例)
              </td>
            </tr>
            <tr>
              <td>Op2 比率</td>
              <td>3.01〜7.01 (色相に比例)</td>
            </tr>
          </tbody>
        </table>
        <p className="table-note">
          √2 はトライトーン (三全音) に近い比率で、不安定で緊張感のある響きを生みます。
        </p>

        <h3>明度 → 鋭さ</h3>
        <p>
          Messiaen では明度が「密度」を制御するのに対し、Kandinsky
          では「鋭さ」を制御します。外周ほどアタックが速く、変調が強い衝撃的な音になります。
        </p>
        <table>
          <thead>
            <tr>
              <th>パラメータ</th>
              <th>外周 (L=50%)</th>
              <th>中心 (L=100%)</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>変調指数 (Op1)</td>
              <td>8.0</td>
              <td>2.0</td>
            </tr>
            <tr>
              <td>変調指数 (Op2)</td>
              <td>5.0</td>
              <td>1.0</td>
            </tr>
            <tr>
              <td>アタック</td>
              <td>0.005 秒 (ほぼ瞬間)</td>
              <td>0.2 秒</td>
            </tr>
            <tr>
              <td>サスティン</td>
              <td>0.3</td>
              <td>0.7</td>
            </tr>
            <tr>
              <td>持続時間</td>
              <td>1.0 秒 (短い)</td>
              <td>4.0 秒 (長い)</td>
            </tr>
          </tbody>
        </table>
        <p className="table-note">
          サブオシレータは使用しません。Messiaen が「温かさの厚み」を加えるのに対し、
          Kandinsky は「鋭さと空間」を優先します。
        </p>
      </section>

      <section className="about-section">
        <h2>2つのモデルの比較</h2>
        <table>
          <thead>
            <tr>
              <th></th>
              <th>Messiaen</th>
              <th>Kandinsky</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>周波数レンジ</td>
              <td>196〜440 Hz (狭い)</td>
              <td>82〜880 Hz (広い)</td>
            </tr>
            <tr>
              <td>キャリア波形</td>
              <td>常に Sine</td>
              <td>色相で切替</td>
            </tr>
            <tr>
              <td>FM比率</td>
              <td>整数比 (2, 3, 4, 5)</td>
              <td>非整数比 (√2, 3.01...)</td>
            </tr>
            <tr>
              <td>オペレータ数</td>
              <td>3</td>
              <td>2</td>
            </tr>
            <tr>
              <td>サブオシレータ</td>
              <td>あり</td>
              <td>なし</td>
            </tr>
            <tr>
              <td>変調指数 (最大)</td>
              <td>4.5</td>
              <td>8.0</td>
            </tr>
            <tr>
              <td>最速アタック</td>
              <td>30 ms</td>
              <td>5 ms</td>
            </tr>
            <tr>
              <td>明度の役割</td>
              <td>密度・レイヤー</td>
              <td>鋭さ・衝撃</td>
            </tr>
            <tr>
              <td>音の印象</td>
              <td>ステンドグラス・発光</td>
              <td>幾何学・空間・金属</td>
            </tr>
          </tbody>
        </table>
      </section>
    </div>
  );
}

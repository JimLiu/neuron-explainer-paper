import React from 'react'
import { mdx } from '@mdx-js/react'

// import Todo from './diagrams/todo'
// import Todos from './diagrams/todos'
import Prompt from './diagrams/prompts'
import Equation from './diagrams/equation'
import Hidden from './components/hidden'
import ScoringToggleImage from './diagrams/scoring_toggle'
import RevisionScoringToggleImage from './diagrams/revision_scoring_toggle'
import LayerSliderImage from './diagrams/layer_slider'
// import ActCorrImage from './diagrams/actcorr'
import Carousel from './diagrams/carousel'
import NeuronCarousel from './diagrams/neuron_carousel'
import DirFindingCompare from './diagrams/dirfinding_compare'
import DecomposedSentences from './diagrams/decomposedSentences'


const layoutProps = {

};
const MDXLayout = "wrapper"
export default function MDXContent({
  components,
  ...props
}) {
  return <MDXLayout {...layoutProps} {...props} components={components} mdxType="MDXLayout">

    <h1 id="sec-intro">
Introduction
    </h1>
    <p>{`Language models have become more capable and more widely deployed, but we do not understand how they work. Recent work has made progress on understanding a small number of circuits and narrow behaviors,`}<d-cite bibtex-key="wang2022interpretability" /><d-cite bibtex-key="chughtai2023toy" />{` but to fully understand a language model, we'll need to analyze millions of neurons. This paper applies automation to the problem of scaling an interpretability technique to all the neurons in a large language model. Our hope is that building on this approach of automating interpretability`}<d-cite bibtex-key="hubinger2021automating" /><d-cite bibtex-key="oikarinen2022clip" /><d-cite bibtex-key="millidge2022singular" />{` will enable us to comprehensively audit the safety of models before deployment.`}</p>
    <p>{`Our technique seeks to explain what patterns in text`}<d-cite bibtex-key="zhong2022describing" /><d-cite bibtex-key="singh2022explaining" />{` cause a neuron to activate. It consists of three steps:`}</p>
    <NeuronCarousel mdxType="NeuronCarousel" />
    {
      /*Carousel
       images={[
         {
           src:"./images/algostep1.png",
           caption: "Step 1: Generate an explanation for a neuron, based on its activations"
         },
         {
           src:"./images/algostep2.png",
           caption: "Step 2: Using the explanation, try to simulate the neuron without access to activations"
         },
         {
           src:"./images/algostep3.png",
           caption: "Step 3: Compare simulated activations against real ones to score the explanation"
         },
       ]}
       hide_caption={true}
      /*/
    }
    <p>{`This technique lets us leverage GPT-4`}<d-cite bibtex-key="openai2023gpt4" />{` to define and automatically measure a quantitative notion of interpretability `}<d-cite bibtex-key="bau2017network" /><d-cite bibtex-key="chan2022causal" />{` which we call an “explanation score”: a measure of a language model's ability to compress and reconstruct neuron activations using natural language.`}<d-cite bibtex-key="hernandez2022natural" />{`. The fact that this framework is quantitative allows us to measure progress toward our goal of making the computations of a neural network understandable to humans.`}</p>
    <p>{`With our baseline methodology, explanations achieved scores approaching the level of human contractor performance. We found we could further improve performance by:`}</p>
    <ul>
      <li><em><a href="#sec-revisions" className="sec-link">Iterating on explanations</a></em>.  We asked GPT-4 to come up with possible counterexamples, and to then revise explanations in light of their activations.</li>
      <li><em><a href="#sec-explainer-scaling" className="sec-link">Using more capable models to give explanations</a></em>.  The average score goes up as the explainer model's capability increases, with GPT-4 achieving the highest scores.</li>
      <li><em><a href="#sec-simulator-scaling" className="sec-link">Using more capable models to simulate activations conditional on an explanation</a></em>.  Both the average score and the agreement between scores and human comparisons go up as the simulator model's capability increases, with GPT-4 achieving the highest scores.</li>
    </ul>
However, we found that both GPT-4-based and human contractor explanations still score poorly in absolute terms.  When looking at neurons, we also found the typical neuron appeared quite polysemantic.  This suggests we should change what we're explaining.  In preliminary experiments, we tried:
    <ul>
      <li><em><a href="#sec-subject-activation" className="sec-link">Changing the architecture of the explained model</a></em>.  We achieved higher explanation scores on models trained with different activation functions.<d-cite bibtex-key="elhage2022solu" /></li>
      <li><em><a href="#sec-direction-finding" className="sec-link">Searching for more explainable directions</a></em>. Our preliminary investigation into direct optimization of scores shows that we can find some well-explained linear combinations of neurons.</li>
    </ul>
    <p>{`We applied our method to all MLP neurons in GPT-2 XL.`}<d-cite bibtex-key="radford2019language" />{` We found over 1,000 neurons with explanations that scored at least 0.8, meaning that according to GPT-4 they account for most of the neuron's top-activating behavior. We used these explanations to build new user interfaces for understanding models,`}<d-cite bibtex-key="carter2019activation" /><d-cite bibtex-key="tenney2020language" /><d-cite bibtex-key="neuroscope" />{` for example allowing us to quickly see which neurons activate on a particular dataset example and what those neurons do.`}</p>
    <DecomposedSentences mdxType="DecomposedSentences" />
    <p>{`We are open sourcing our dataset of explanations for all neurons in GPT-2 XL, `}<a href="https://github.com/openai/automated-interpretability/tree/main/neuron-explainer">{`code for explanation and scoring`}</a>{` to encourage further research in both producing better explanations.  We are also releasing a `}<a href="https://openaipublic.blob.core.windows.net/neuron-explainer/neuron-viewer/index.html">{`neuron viewer`}</a>{` using the dataset.  Although most well-explained neurons are not very interesting, we found `}<a href="#sec-interesting-neurons" className="sec-link">{`many interesting neurons`}</a>{` that GPT-4 didn't understand.  We hope this lets others more easily `}<a href="#sec-future-work" className="sec-link">{`build on top of our work`}</a>{`.  With better explanations and tools in the future, we may be able to rapidly uncover interesting qualitative understanding of model computations.`}</p>
    <h1 id="sec-methods">
Methods
    </h1>
    <h2 id="sec-setting">
Setting
    </h2>
Our methodology involves multiple language models:
    <ul>
      <li>
The <b>subject model</b> is the model that we are attempting to interpret.
      </li>
      <li>
The <b>explainer model</b> comes up with hypotheses about subject model behavior. <d-footnote>The subject and the explainer can be the same model, though for our experiments we typically use smaller models as subjects and our strongest model as the explainer. In the long run, the situation may be reversed if the subject is our strongest model but we don't trust it as an assistant.</d-footnote>
      </li>
      <li>
The <b>simulator model</b> makes predictions based on the hypothesis.  Based on how well the predictions match reality, we can judge the quality of the hypothesis. The simulator model should interpret hypotheses the same way an idealized human would.  <d-footnote>Thus, while the explainer model should be trained to be as helpful as possible using RL (using the simulator model as a training signal), the simulator should be trained to imitate humans.  If the simulator model improved its performance by making predictions that humans would disagree with, we would potentially risk explanations not being human-understandable.</d-footnote>
      </li>
    </ul>
    <p>{`In this paper we start with the easiest case of identifying properties of text inputs that correlate with intermediate activations.`}<d-cite bibtex-key="erhan2009visualizing" /><d-cite bibtex-key="yosinski2015understanding" /><d-cite bibtex-key="olah2017feature" />{` We ultimately want to extend our method to explore arbitrary hypotheses about subject model computations.`}</p>
    <p>{`In the language model case, the inputs are text passages.  For the intermediate activations, we focus on neurons in the MLP layers.  For the remainder of this paper, activations refer to the MLP post-activation value calculated as `}<Equation equation="a = \mathrm{f}(W_{in} \cdot x + b)" mdxType="Equation" />{`, where $\\mathrm{f}$ is a nonlinear activation function (specifically GELU`}<d-cite bibtex-key='hendrycks2016gaussian' />{` for GPT-2).  The neuron activation is then used to update the residual stream by adding `}<Equation equation="a \cdot W_{out}" mdxType="Equation" />{`.  `}</p>
    <p>{`When we have a hypothesized explanation for a neuron, the hypothesis is that the neuron activates on tokens with that property, where the property may include the previous tokens as context.`}</p>
    <h2 id="sec-algorithm">
Overall algorithm
    </h2>
    <p>{`At a high level, our process of interpreting a neuron uses the following algorithm:`}</p>
    <ul>
      <li><b>Explain</b>: Generate an explanation of the neuron’s behavior by showing the explainer model (token, activation) pairs from the neuron’s responses to text excerpts</li>
      <li><b>Simulate</b>: Use the simulator model to simulate the neuron's activations based on the explanation</li>
      <li><b>Score</b>: Automatically score the explanation based on how well the simulated activations match the real activations</li>
    </ul>
    <p>{`We always use distinct documents for explanation generation and simulation.`}<d-footnote>{`However, we did not explicitly check that the resulting text excerpts do not overlap.  While in principle it would be reasonable for an explanation to "memorize" behavior to the extent that it drives most of the subject model's behavior on the training set, it would be less interesting if that was the primary driver of high scores. Based on some simple checks of our text excerpts, this was a non-issue for at least 99.8% of neurons.`}</d-footnote></p>
    <p>{`Our code for generating explanations, simulating neurons, and scoring explanations is `}<a href="https://github.com/openai/automated-interpretability/tree/main/neuron-explainer">{`available here`}</a>{`.`}</p>
    <h3 id="sec-algorithm-explain">
Step 1: Generate explanations of the neuron's behavior
    </h3>
In this step, we create a prompt that is sent to the explainer model to generate one or more explanations of a neuron's behavior.  The prompt consists of few-shot examples of other real neurons, with tab-separated (token, activation) pairs from text excerpts and researcher-written explanations.  Finally, the few-shot example contains tab-separated (token, activation) pairs from text excerpts for the neuron being interpreted.<d-footnote>All prompts are shown in an abbreviated format, and are modified somewhat when using the structured chat completions API.  For full details see <a href="https://github.com/openai/automated-interpretability/tree/main/neuron-explainer">our codebase</a>.</d-footnote>
    <Prompt prompt={'explanation'} description={'abbreviated version of the explanation generation prompt'} mdxType="Prompt" />
    <p>{`Activations are normalized to a 0-10 scale and discretized to integer values, with negative activation values mapping to 0 and the maximum activation value ever observed for the neuron mapping to 10.  For sequences where the neuron's activations are sparse (<20% non-zero), we found it helpful to additionally repeat the token/activation pairs with non-zero activations after the full list of tokens, helping the model to focus on the relevant tokens.`}</p>
    <h3 id="sec-algorithm-simulate">
Step 2: Simulate the neuron's behavior using the explanations
    </h3>
With this method, we aim to answer the question: supposing a proposed explanation accurately and comprehensively explains a neuron's behavior, how would that neuron activate for each token in a particular sequence? To do this, we use the simulator model to simulate neuron activations for each subject model token, conditional on the proposed explanation.
    <p>{`We prompt the simulator model to output an integer from 0-10 for each subject model token. For each predicted activation position, we examine the probability assigned to each number ("0", "1", …, "10"), and use those to compute the expected value of the output. The resulting simulated neuron value is thus on a `}{`[0, 10]`}{` scale.`}</p>
    <p>{`Our simplest method is what we call the "one at a time" method.  The prompt consists of some few-shot examples and a single-shot example of predicting an individual token's activation. `}</p>
    <Prompt prompt={'simulate_one_at_a_time'} description={'abbreviated "one at a time" prompt'} mdxType="Prompt" />
    <p>{`Unfortunately, the "one at a time" method is quite slow, as it requires one forward pass per simulated token.  We use a trick to parallelize the probability predictions across all tokens by having few-shot examples where activation values switch from being "unknown" to being actual values at a random location in the sequence.  This way, we can simulate the neuron with "unknown" in the context while still eliciting model predictions by examining logprobs for the "unknown" tokens, and without the model ever getting to observe any actual activation values for the relevant neuron.  We call this the "all at once" method.`}</p>
    <Prompt prompt={'simulate_all_at_once'} description={'abbreviated "all at once" prompt'} mdxType="Prompt" />
    <p>{`Due to the speed advantage, we use "all at once" scoring for the remainder of the paper, except for some of the smaller-scale qualitative results. `}<d-footnote>{`While we used GPT-4 as the simulator model for most of our experiments, the public OpenAI API does not support returning logprobs for newer chat-based models like GPT-4 and GPT-3.5-turbo. Older models like the original GPT-3.5 support logprobs.`}</d-footnote>{`  In addition to being faster, we surprisingly found scores computed using the "all at once" method to be as accurate as the "one at a time" method at predicting human preferences between explanations.`}<d-footnote>{`"All at once" actually outperformed "one at a time", but the effect was within noise, and researchers subjectively thought "one at a time" was better, on relatively small sample sizes.`}</d-footnote></p>
    <h3 id="sec-algorithm-score">
Step 3: Score the explanations by comparing the simulated and actual neuron behavior
    </h3>
Conceptually, given an explanation and simulation strategy, we now have a <b>simulated neuron</b>, a "neuron" for which we can predict activation values for any given text excerpt.  To score an explanation, we want to compare this simulated neuron against the real neuron for which the explanation was generated.  That is, we want to compare two lists of values: the simulated activation values for the explanation over multiple text excerpts, and the actual activation values of the real neuron on the same text excerpts.
    <p>{`A conceptually simple approach is to use explained variance of the true activations by the simulated activations, across all tokens.  That is, we could calculate `}<Equation equation="1 - \frac{\mathbb{E}_t[(s(t) - a(t))^2]}{\mathrm{Var}_t(a(t))}" mdxType="Equation" />{`, where $s(t)$ indicates the simulated activation given the explanation, and $a(t)$ indicates the true activation, and expectations are across all tokens from the chosen text excerpts.  `}<d-footnote>{`Note that this isn't an unbiased estimator of true explained variance, since we also use a sample for the denominator.  One could improve on our approach by using a much larger sample for estimating the variance term.`}</d-footnote></p>
    <p>{`However, our simulated activations are on a `}{`[0, 10]`}{` scale, while real activations will have some arbitrary distribution.  Thus, we assume the ability to calibrate the simulated neuron's activation distribution to the actual neuron's distribution.  We chose to simply calibrate linearly`}<d-footnote>{`We explored more complicated methods to calibrate, but they typically require many simulations, which are expensive to obtain`}</d-footnote>{` on the text excerpts being scored with.`}<d-footnote>{`Conceptually, calibration should ideally happen on a different set of text excerpts, so we aren't "cheating" by using the true mean and variance.  We empirically studied this cheating effect for differing sample sizes and believe it to be small in practice.`}</d-footnote>{`  If $\\rho$ is the correlation coefficient between the true and simulated activations, then we scale simulations so their mean matches that of the true activations, and their standard deviation is $\\rho$ times the standard deviation of the true activations.  This maximizes explained variance at $\\rho^2$`}<d-footnote>{`Matching standard deviations results in explained variance of $2 \\rho - 1 < \\rho^2$.  We also find empirically that it performs worse in `}<a href="#sec-ablation-scoring" className="sec-link">{`ablation based scoring`}</a>{`.`}</d-footnote>{`.`}</p>
    <p>{`This motivates our main method of scoring, correlation scoring, which simply reports $\\rho$. Note then that if the simulated neuron behaves identically to the real neuron, the score is 1.  If the simulated neuron behaves randomly, e.g. if the explanation has nothing to do with the neuron behavior, the score will tend to be around 0.  `}</p>
    <h4 id="sec-ablation-scoring">
Validating against ablation scoring
    </h4>
    <p>{`Another way to understand a network is to perturb its internal values during a forward pass and observe the effect.`}<d-cite bibtex-key="vig2020causal" /><d-cite bibtex-key="meng2022locating" /><d-cite bibtex-key="chan2022causal" />{`  This suggests a more expensive approach to scoring, where we replace the real neuron with the simulated neuron (i.e. ablate its activations to simulated activation values) and check whether the network behavior is preserved.`}</p>
    <p>{`To measure the extent of the behavioral change from ablating to simulation, we use Jensen-Shannon divergence between the perturbed and original model’s output logprobs, averaged across all tokens.  As a baseline for comparison, we perform a second perturbation, ablating the neuron’s activation to its mean value across all tokens. For each neuron, we normalize the divergence of ablating to simulation by the divergence of ablating to the mean.  Thus, we express an ablation score as `}<Equation equation="1 - \frac{\mathbb{E}_x[\textrm{AvgJSD}(m(x, n=s(x))) || m(x))]}{\mathbb{E}_x[\textrm{AvgJSD}(m(x, n=\mu) || m(x))]}" mdxType="Equation" />{`, where $m(x, n=\\ldots)$ indicates running the model over the text excerpt $x$ with the neuron ablated and returning a predicted distribution at each token, $\\textrm{AvgJSD}$ takes the Jensen-Shannon divergences at each token and averages them, $s(x)$ is the linearly calibrated vector of simulated neuron values on the sequence, and $\\mu$ is the average activation for that neuron across all tokens. Note that for this ablation score, as for the correlation score, chance performance results in a score of 0.0, and perfect performance results in a score of 1.0.`}</p>
    <ScoringToggleImage random_only_image="./images/ablation_js_loss_vs_corr_coef_binned_fill_between_use_log_False_show_sem_True_random.jpg" random_and_top_image="./images/ablation_js_loss_vs_corr_coef_binned_fill_between_use_log_False_show_sem_True_top_and_random.jpg" mdxType="ScoringToggleImage" />
    <p>{`We find that correlation scoring and ablation scoring have a clear relationship, on average.  Thus, the remainder of the paper uses correlation scoring, as it is much simpler to compute.  Nevertheless, correlation scoring appears not to capture all the deficits in simulated explanations revealed by ablation scoring.  In particular, correlation scores of 0.9 still lead to relatively low ablation scores on average (0.3 for scoring on random-only text excerpts and 0.6 for top-and-random; see `}<a href="#sec-algorithm-details" className="sec-link">{`below`}</a>{` for how these text excerpts are chosen).`}<d-footnote>{`This might happen if subtle variations in the activation of a neuron (making the difference, say, between a correlation score of 0.9 and 1.0) played an outsized role in its function within the network.`}</d-footnote></p>
    <h4 id="sec-human-scoring">
Validating against human scoring
    </h4>
One potential worry is that simulation-based scoring does not actually reflect human evaluation of explanations (<a href="#sec-limitation-simulator" className="sec-link">see here for more discussion</a>).  We gathered human evaluations of explanation quality to see whether they agreed with score-based assessment.
    <p>{`We gave human labelers tasks where they see the same text excerpts and activations (shown with color highlighting) as the simulator model (both top-activating and random), and are asked to rate and then rank 5 proposed explanations based on how well those explanations capture the activation patterns.  We found the explainer model explanations were not diverse, and so increased explanation diversity by varying the few-shot examples used in the explanation generation prompt, or by using a modified prompt that asks the explainer model for a numbered list of possible explanations in a single completion.`}</p>
    <img style={{
      width: "80%"
    }} className='centered-img' src="./images/higher_preferred_rate_by_score_diff.png" />
    <p>{`Our results show that humans tend to prefer higher-scoring explanations over lower-scoring ones, with the consistency of that preference increasing as the size of the score gap increases.`}</p>
    <h3 id="sec-algorithm-details">
Algorithm parameters and details
    </h3>
    <p>{`Throughout this work, unless otherwise specified, we use GPT-2 pretrained models as subject models and GPT-4 for the explainer and simulator models. `}<d-footnote>{`Unlike GPT-2, GPT-4 is a model trained to follow instructions via RLHF.`}<d-cite bibtex-key='ouyang2022training' /></d-footnote></p>
    <p>{`For both generating and simulating explanations, we take text excerpts from the training split of the subject model's pre-training dataset (e.g. WebText, for GPT-2 models).  We choose random 64-token contiguous subsequences of the documents as our text excerpts.`}<d-footnote>{`Note that since GPT-2 models use byte-pair encoders, sometimes our texts have mid-character breaks.  See `}<a href="#sec-limitation-tokenization" className="sec-link">{`here for more discussion`}</a>{`.`}</d-footnote>{`, formatted identically to how the models were trained, with the exception that we never cross document boundaries.`}<d-footnote>{`GPT-2 was trained to sometimes see multiple documents, separated by a special end of text token.  In our work, we ensure all 64 tokens are within the same document.`}</d-footnote></p>
    <p>{`When generating explanations, we use 5 "top-activating" text excerpts, which have at least one token with an extremely large activation value, as determined by the quantile of the max activation.  This was because we found empirically that:`}</p>
    <ul>
      <li>Exclusively using top-activating sequences in the explanation generation prompt yielded the best explanation scores, even when scoring only against random sequences or against sequences with activations in lower quantiles (see figure below).  In fact, we found noticeable gains even going from top 1 in 20,000 to top 1 in 60,000 text excerpts.</li>
      <li>Explanation scores were highest when using 16-64 token text excerpts, even when the sequences used for scoring were longer.</li>
      <li>Using more than 5-10 text excerpts for explanation generation does not significantly affect scores (though there is some interaction with sequence length).</li>
      <li>Including examples of random or lower-quantile sequences in the explanation generation prompt reduced explanation scores.</li>
      <li>Interpreting maximally <em>negative</em> activation sequences also gave extremely low explanation scores. <d-footnote>For other activation functions like GeGLU,<d-cite bibtex-key="shazeer2020glu" /> this would likely be untrue and we would need to separately explain positive and negative activations.</d-footnote></li>
    </ul>
    <img style={{
      width: '80%'
    }} className='centered-img' src="./plots/quantile_scaling.png" />
    <p>{`Thus, for the remainder of this paper, explanations are always generated from 5 top-activating sequences unless otherwise noted.  We set a top quantile threshold of 0.9996, taking the 20 sequences containing the highest activations out of 50,000 total sequences.  We sample explanations at temperature 1.`}</p>
    <p>{`For simulation and scoring, we report on 5 uniformly random text excerpts ("random-only"). The random-only score can be thought of as an explanation’s ability to capture the neuron’s representation of features in the pre-training distribution. While random-only scoring is conceptually easy to interpret, we also report scores on a mix of 5 top-activating and 5 random text excerpts ("top-and-random"). The top-and-random score can be thought of as an explanation’s ability to capture the neuron’s most strongly represented feature (from the top text excerpts), with a penalty for overly broad explanations (from the random text excerpts). Top-and-random scoring has several pragmatic advantages over random-only:`}</p>
    <ul>
      <li>Random text excerpts cause significantly higher variance scores.  Empirically, we found that neurons which do well on random-only scoring are dense-activating neurons.  Most neurons are quite sparse, and while means across large numbers of neurons are likely to be informative, individual neuron scores are generally uninformative.</li>
      <li>Given polysemanticity,<d-cite bibtex-key="olah2020zoom" /><d-cite bibtex-key="elhage2022superposition" /> neurons <a href="#sec-limitation-unexplainable" className="sec-link">could need extremely long/disjunctive explanations</a>.  Even a neuron that corresponds to one feature could have substantial interference from other features.  Explaining only the behavior at the extremes seemed like a reasonable way to get cleaner features, which may be more analogous to what we hope to be explaining in the long run.</li>
      <li>We wanted to be able to score on adversarially chosen text excerpts, e.g. for our <a href="#sec-revisions" className="sec-link">explanation revisions</a>.  It was more challenging to do this while maintaining the uniform-over-pre-training interpretation.  <d-footnote>In the long term, we want to move toward something debate-like <d-cite bibtex-key="irving2018ai" /> where the score is more like a minimax than an expectation.  That is, we imagine one model coming up with an explanation and another model coming up with counterexamples.  Scoring would take the whole transcript into consideration, and thus measure how robust the hypothesis is.</d-footnote>  Furthermore, a perfect correlation (or explained variance) of 1 still has a similar interpretation.</li>
    </ul>
    <p>{`Note that "random-only" scoring with small sample size risks failing to capture behavior, due to lacking both tokens with high simulated activations and tokens with high real activations.  "Top-and-random" scoring addresses the latter, but causes us to penalize falsely low simulations more than falsely high simulations, and thus tends to accept overly broad explanations.  A more principled approach which gets the best of both worlds might be to stick to random-only scoring, but increase the number of random-only text excerpts in combination with using importance sampling as a variance reduction strategy.  `}<d-footnote>{`Unfortunately, initial attempts at this using a moderate increase in number of text excerpts did not prove to be useful.`}</d-footnote></p>
    <p>{`Below we show some prototypical examples of neuron scoring.`}</p>
    <Carousel images={[{
      src: "./images/real_vs_simulated_activations_0_1295_top_and_random.jpg",
      caption: "a neuron with a particularly good top-and-random score, but bad random-only score, due to behavior in the low-activation regime"
    }, {
      src: "./images/real_vs_simulated_activations_15_5473_top_and_random.jpg",
      caption: "a neuron with poor scores"
    }, {
      src: "./images/real_vs_simulated_activations_5_2764_top_and_random.jpg",
      caption: "a neuron with a particularly good top-and-random score, but bad random-only score, due to falsely high simulations"
    }, {
      src: "./images/real_vs_simulated_activations_6_1746_top_and_random.jpg",
      caption: "a neuron with good top-and-random and random-only scores"
    }]} mdxType="Carousel" />
    <h1 id="sec-results">
Results
    </h1>
    <div style={{
      fontSize: 'small',
      lineHeight: '1.3em',
      marginBottom: '15px'
    }}>
      <b>Notes on interpretation</b>:  Throughout this section, our results may be obtained using slightly differing methodologies (e.g. different explainer models, different prompts, etc.).  Thus scores are not always comparable across graphs.  In all plots, error bars correspond to a 95% confidence interval for the mean.  <d-footnote>In most places, we calculate this using 1.96 times the standard error of the mean (SEM), or a strictly more conservative statistic.  If needed we estimate via bootstrap resampling methods.</d-footnote>
    </div>
    <p>{`Overall, for GPT-2, we find an average score of 0.151 using top-and-random scoring, and 0.037 for random-only scoring.  Scores generally decrease when going to later layers.`}</p>
    <LayerSliderImage mdxType="LayerSliderImage" />
    <p>{`Note that individual scores for neurons may be noisy, especially for random-only scoring.  With that in mind, out of a total of 307,200 neurons, 5,203 (1.7%) have top-and-random scores above 0.7 (explaining roughly half the variance), using our default methodology.  With random-only scoring, this drops to 732 neurons (0.2%).  Only 189 neurons (0.06%) have top-and-random scores above 0.9, and 86 (0.03%) have random-only scores above 0.9.`}</p>
    <h2 id="sec-baselines">
Unigram baselines
    </h2>
    <p>{`To understand the quality of our explanations in absolute terms, it is helpful to compare with a baseline that does not depend on language models' ability to summarize or simulate activations. For this reason, we examine several baseline methods that directly predict activation based on a single token, using either model weights, or activation data aggregated across held out texts. For each neuron, these methods give one predicted activation value per token in the vocabulary, which amounts to substantially more information than the short natural language explanation produced by a language model. For that reason, we also used language models to briefly summarize these lists of activation values, and used that as an explanation in our typical simulation pipeline.`}</p>
    <Prompt prompt={'token_explanation'} description={'abbreviated token explanation prompt'} mdxType="Prompt" />
    <h3 id="sec-token-weight">
Token-based prediction using weights
    </h3>
    <p>{`The logit lens and related techniques `}<d-cite bibtex-key="nostalgebraist2020interpreting" /><d-cite bibtex-key="dar2022analyzing" />{` relate neuron weights to tokens, to try to interpret neurons in terms of tokens that cause them to activate, or tokens that the neuron causes the model to sample. Fundamentally, these techniques depend on multiplying the input or output weights of a neuron by either the embedding or unembedding matrix. `}</p>
    <p>{`To linearly predict activations for each token, we multiply each token embedding by the pre-MLP layer norm gain and neuron input weights ($W_{in}$). This methodology allows for a single scalar value to be assigned to each token in the vocabulary. The predicted activation with this method depends only on the current token and not on the preceding context. These scalar values are used directly to predict the activation for each token, with no summarization. These weight-based linear predictions are mechanistic or “causal” explanations in that the weights directly affect the neuron’s pattern of inputs, and thus its pattern of activations.`}</p>
    <p>{`The linear token-based prediction baseline outperforms activation-based explanation and scoring for the first layer, predicting activations almost perfectly (unsurprising given that only the first attention layer intervenes between the embedding and first MLP layer). For all subsequent layers, GPT-4-based explanation and scoring predicts activations better than the linear token-based prediction baseline.`}<d-footnote>{`We also tried linear prediction including the position embedding for each position in the text excerpt plus the token embedding; this linear token- and position-based prediction baseline resulted in very small quantitative improvements and no qualitative change.`}</d-footnote>{` `}</p>
    <p>{`The linear token-based prediction baseline is a somewhat unfair comparison, as the "explanation length" of one scalar value per token in the vocabulary is substantially longer than GPT-based natural language explanations. Using a language model to compress this information into a short explanation and simulate that explanation might act as an “information bottleneck” that affects the accuracy of predicted activations. To control for this, we try a hybrid approach, applying GPT-4-based explanation to the list of tokens with the highest linearly predicted activations (corresponding to 50 out of the top 100 values), rather than to top activations. These explanations score worse than either linear token-based prediction or activation-based explanations.`}</p>
    <ScoringToggleImage random_only_image="./images/layerwise_score_errorbars_token_linear_random.png" random_and_top_image="./images/layerwise_score_errorbars_token_linear_all.png" mdxType="ScoringToggleImage" />
    <h3 id="sec-token-table">
Token-based prediction using lookup tables
    </h3>
    <p>{`The token-based linear prediction baseline might underperform the activation-based baseline for one of several reasons. First, it might fail because multi-token context is important (for example, many neurons are sensitive to multiple-token phrases). Second, it might fail because intermediate processing steps between the token embedding and $W_{in}$ are important, and the linear prediction is a poor representation of the true causal impact of a token on a neuron's activity.`}</p>
    <p>{`To evaluate the second possibility, we construct a second, “correlational” baseline. For this baseline, we compute the mean activation per-token and per-neuron over a large corpus of held-out internet text. We then use this information to construct a lookup table. For each token in a text excerpt and for each neuron, we predict the neuron's activation using the token lookup table, independent of the preceding tokens. Again, we do not summarize the contents of this lookup table, or use a language model to simulate activations.`}</p>
    <p>{`The token lookup table baseline is much stronger than the token-based linear prediction baseline, substantially outperforming activation-based explanation and simulation on average. We apply the same explanation technique as with the `}<a href="#sec-token-weight" className="sec-token-weight">{`token-based linear baseline`}</a>{` to measure how the information bottleneck from explanation and simulation using GPT-4 affects the accuracy of predicted activations. `}</p>
    <p>{`The resulting token lookup table-based explanation results in a score similar to our activation-based explanation on top-and-random scoring, but outperforms activation-based explanations on random-only scoring.  However, we are most interested in neurons that encode complex patterns of multi-token context rather than single tokens. Despite worse performance on average, we find `}<a href="#sec-interesting-neurons" className="sec-interesting-neurons">{`many interesting neurons`}</a>{` where activation-based explanations have an advantage over token-lookup-table-based explanations. We are also able to improve over the token-lookup-table-based explanation by `}<a href="#sec-revisions" className="sec-revisions">{`revising explanations`}</a>{`.  In the long run, we plan to use methods that combine both token-based and activation-based information.`}</p>
    <ScoringToggleImage random_only_image="./images/layerwise_score_errorbars_token_lookup_random.png" random_and_top_image="./images/layerwise_score_errorbars_token_lookup_all.png" mdxType="ScoringToggleImage" />
    <h2 id="sec-next-token">
Next-token-based explanations
    </h2>
We noticed that some neurons appear to encode the predicted next token rather than the current token, particularly in later layers (see the “from”-predicting neuron described <a href="#sec-interesting-neurons" className="sec-link">below</a>). Our baseline methodology, which prompts GPT-4 with (<i>preceding</i> token, activation) pairs, is unable to capture this behavior. As an alternative, we prompt GPT-4 to explain and simulate the neuron’s activations based on the tokens following its highest activations by using (<i>next</i> token, activation) pairs instead. This approach is more successful for a subset of neurons, particularly in later layers, and achieves similar scores on average to the baseline method in the last few layers.
    <ScoringToggleImage random_only_image="./images/layerwise_score_errorbars_next_token_random.png" random_and_top_image="./images/layerwise_score_errorbars_next_token_all.png" mdxType="ScoringToggleImage" />
    <h2 id="sec-revisions">
Revising explanations
    </h2>
    <p>{`Explanation quality is fundamentally bottlenecked by the small set of text excerpts and activations shown in a single explanation prompt, which is not always sufficient to explain a neuron's behavior.  Iterating on explanations`}<d-cite bibtex-key="singh2022explaining" />{` would potentially let us leverage more information effectively, relying on the emergent ability of large language models to use reasoning to improve responses at test time.`}<d-cite bibtex-key="wei2022chain" /><d-cite bibtex-key="saunders2022self" /><d-footnote>{`As noted `}<a href="#sec-algorithm-details" className="sec-link">{`above`}</a>{`, in the non-iterative setting we find the explainer model is unable to effectively make use of additional text excerpts in context.`}</d-footnote></p>
    <p>{`One particular issue we find is that overly broad explanations tend to be consistent with the top-activating sequences.  For instance, we found a `}<a href="https://openaipublic.blob.core.windows.net/neuron-explainer/neuron-viewer/index.html#/layers/13/neurons/1352">{`"not all" neuron`}</a>{` which activates on the phrase "not all" and some related phrases.  However, the top-activating text excerpts chosen for explanation do not falsify a simpler hypothesis, that the neuron activates on the phrase "all".  The model thus generates an overly broad explanation: 'the term "all" along with related contextual phrases'.`}<d-footnote>{`When one of us looked uncarefully at this neuron, we too came to this conclusion. It was only after testing examples of sequences like "All students must turn in their final papers by Monday" that we realized the initial explanation was too broad.`}</d-footnote>{` Nevertheless, observing activations for text excerpts containing "all" in different contexts reveals that the neuron is actually activating for "all", but only when part of the phrase "not all". From this example and other similar examples we concluded that sourcing new evidence beyond the top and random activation sequences would be helpful for more fully explaining some neurons.`}</p>
    <p>{`To make things worse, we find that our explainer technique often fails to take into account negative evidence (i.e. examples of the neuron not firing which disqualify certain hypotheses). With the "not all" neuron, even when we manually add negative evidence to the explainer context (i.e. sequences that include the word "all" with zero activation), the explainer ignores these and produces the same overly broad explanation.  The explainer model may be unable to pay attention to all facets of the prompt in a single forward pass.`}</p>
    <p>{`To address these issues, we apply a two-step revision process.`}</p>
    <p>{`The first step is to source new evidence. We use a few-shot prompt with GPT-4 to generate 10 sentences which match the existing explanation.  For instance, for the "not all" neuron, GPT-4 generates sentences which use the word "all" in a non-negated context.`}</p>
    <Prompt prompt={'sentence_generation'} description={'sentence generation prompt'} mdxType="Prompt" />
    <p>{`The hope is to find false positives for the original explanation, i.e. sentences containing tokens where the neuron's real activation is low, but the simulated activation is high.  However, we do not filter generated sentences for this condition.  In practice, roughly 42% of generated sequences result in false positives for their explanations. For 86% of neurons at least one of the 10 sequences resulted in a false positive. This provides an independent signal that our explanations are often too inclusive.  We split the 10 generated sentences into two sets: 5 for revision and 5 for scoring. Once we have generated the new sentences, we perform inference using the subject model and record activations for the target neurons.`}</p>
    <p>{`The second step is to use a few-shot prompt with GPT-4 to revise the original model explanation. The prompt includes the evidence used to generate the original explanation, the original explanation, the new generated sentences, and the ground truth activations for those sentences. Once we obtain a revised explanation, we score it on the same set of sequences used to score the original explanation. We also score the original explanation and the revised explanation on the same set augmented with the scoring split of the new evidence.`}</p>
    <Prompt prompt={'revision'} description={'abbreviated version of the explanation revision prompt'} mdxType="Prompt" />
    <p>{`We find that the revised explanations score better than the original explanations on both the original scoring set and the augmented scoring set. As expected, the original explanations score noticeably worse on the augmented scoring set than the original scoring set.`}</p>
    <RevisionScoringToggleImage random_and_top_and_extra_image="./plots/revision.top_and_random_and_extra.png" random_and_top_image="./plots/revision.top_and_random.png" mdxType="RevisionScoringToggleImage" />
    <p>{`We find that revision is important:  a baseline of re-explanation with the new sentences ("reexplanation") but without access to the old explanation does not improve upon the baseline. As a followup experiment, we attempted revision using a small random sample of sentences with nonzero activations ("revision_rand"). We find that this strategy improves explanation scores almost as much as revision using generated sentences. We hypothesize that this is partly because random sentences are also a good source of false positives for initial explanations: roughly 13% of random sentences contain false positive activations for the original model explanations.`}</p>
    <p>{`Overall, revisions lets us exceed scores on the token lookup table explanations for top-and-random but not random-only scoring, for which the improvement is limited.  `}<d-footnote>{`Our revision process is also agnostic to the explanation it starts with, so we could likely also start from our strong unigram baselines and revise based on relevant sentences.  We suspect this will outperform our existing results and plan to try techniques like this in the future.`}</d-footnote></p>
    <ScoringToggleImage random_only_image="./images/revision-and-baselines.random.png" random_and_top_image="./images/revision-and-baselines.all.png" mdxType="ScoringToggleImage" />
    <p>{`Qualitatively, the main pattern we observe is that the original explanation is too broad and the revised explanation is too narrow, but that the revised explanation is closer to the truth. For instance, for `}<a href="https://openaipublic.blob.core.windows.net/neuron-explainer/neuron-viewer/index.html#/layers/0/neurons/4613">{`layer 0 neuron 4613`}</a>{` the original explanation is "words related to cardinal directions and ordinal numbers". GPT-4 generated 10 sentences based on this explanation that included many words matching this description which ultimately lacked significant activations, such as "third", "eastward", "southwest". The revised explanation is "this neuron activates for references to the ordinal number 'Fourth'", which gives far fewer false positives. Nevertheless, the revised explanation does not fully capture the neuron's behavior as there are several activations for words other than fourth, like "Netherlands" and "white".`}</p>
    <p>{`We also observe several promising improvements enabled by revision that target problems with the original explanation technique. For instance, a common neuron activation pattern is to activate for a word but only in a very particular context. An example of this is `}<a href="https://openaipublic.blob.core.windows.net/neuron-explainer/neuron-viewer/index.html#/layers/12/neurons/2884">{`the "hypothetical had" neuron`}</a>{`, which activates for the word "had" but only in the context of hypotheticals or situations that might have occurred differently (e.g. "I would have shut it down forever had I the power to do so."). The original model explanation fails to pick up on this pattern and produces the overly-broad explanation, "the word 'had' and its various contexts." However, when provided with sentences containing false positive activations (e.g. "He had dinner with his friends last night") the reviser is able to pick up on the true pattern and produce a corrected explanation. Some other neuron activation patterns that the original explanation fails to capture but the revised explanation accounts for are "the word 'together' but only when preceded by the word 'get'" (e.g. "get together", "got together"), and "the word 'because' but only when part of the 'just because' grammar structure" (e.g. "just because something looks real, doesn't mean it is"). `}</p>
    <p>{`In the future, we plan on exploring different techniques for improving evidence sourcing and revision such as sourcing false negatives, applying chain of thought methods, and fine-tuning.  `}</p>
    <h2 id="sec-direction-finding">
Finding explainable directions
    </h2>
    <p>{`Explanation quality is also bottlenecked by the extent to which neurons are succinctly explainable in natural language.  We found many of the neurons we inspected were polysemantic, potentially due to superposition. `}<d-cite bibtex-key="elhage2022superposition" /><d-cite bibtex-key="gurnee2023finding" />{`  This suggests a different way to improve explanations by improving what we're explaining.  We explore a simple algorithm that leverages this intuition, using our automated methodology for a possible angle of attack on superposition.`}</p>
    <p>{`The high-level idea is to optimize a linear combination of neurons.`}<d-footnote>{`This method can also be applied to the residual stream, because it does not assume a privileged basis at all.`}</d-footnote>{`  Given a vector of activations $a$ and unit vector $\\theta$ (the direction), we define a virtual neuron which has activations `}<Equation equation="a_\theta = a^T \Sigma^{-1/2} \theta" mdxType="Equation" />{`, where $\\Sigma$ is the covariance matrix of $a$.`}<d-footnote>{`We found in early experiments that without reparameterization by $\\Sigma^{-1/2}$, high-variance neurons would otherwise disproportionately dominate the selected vectors, causing a reduction in sample diversity. The reparameterization using $\\Sigma^{-1/2}$ ensures that the initialization favors lower-variance directions and that step sizes are scaled appropriately. Despite the reparameterization, we still observe some amount of collapse.`}</d-footnote>{`  `}</p>
    <p>{`Starting with a uniformly random direction $\\theta$, we then optimize using coordinate ascent, alternating the following steps:`}</p>
    <ol>
      <li>Explanation step: Optimize over explanations by searching for an explanation that explains $a_\theta$ well (i.e achieves a high explainer score).</li>
      <li>Update step: Optimize over $\theta$ by computing the gradient of the score and perform gradient ascent. Note that our correlation score is differentiable with respect to $\theta$, so long as the explanation and simulated values are fixed.</li>
    </ol>
    <p>{`For the explanation step, the simplest baseline is to simply use the typical top-activation-based explanation method (where activations are for the virtual neuron at each step).  However, to improve the quality of the explanation step, we use the revisions with generated negatives, and also reuse high-scoring explanations from previous steps.`}</p>
    <p>{`We run this algorithm on 50 neurons from GPT-2 small's layer 10 (the penultimate MLP layer), for 10 iterations.  For the gradient ascent we use Adam with lr=1e-2, $\\beta_1$=0.9, and $\\beta_2$=0.999.  We also rescale $\\theta$ to be unit norm each iteration.`}</p>
    <p>{`We find that the average top-and-random score after 10 iterations is 0.718, substantially higher than the average score for random neurons in this layer (0.147), and higher than the average score for random directions before any optimization (0.061). `}</p>
    <img style={{
      width: "80%"
    }} className='centered-img' src="./plots/dirfinding-scores.png" />
    <p>{`One potential problem with this procedure is that we could repeatedly converge upon the same explainable direction, rather than finding a diverse set of local maxima.  To check the extent to which this is happening, we measure and find that the resulting directions have very low cosine similarity with each other.`}</p>
    <p>{`We also inspect the neurons which contribute most to $\\Sigma^{-1/2}\\theta$ and qualitatively observe that they are often completely semantically unrelated, suggesting that the directions found are not just specific neurons or small combinations of semantically similar neurons. If we truncate to only the top $n$ neurons by correlation of its activations with the direction's activations, we find that a very large number of neurons is needed to recover the score (with the explanation fixed).`}<d-footnote>{`We also tried truncating based on magnitude of coefficient, which resulted in even poorer scores.`}</d-footnote></p>
    <div>
      <img style={{
        width: "50%"
      }} src="./plots/dirfinding-cos.png" />
      <img style={{
        width: "50%"
      }} src="./images/dirfinding-component-truncation.png" />
    </div>
    <DirFindingCompare mdxType="DirFindingCompare" />
    <p>{`One major limitation of this method is that care must be taken when optimizing for a learned proxy of explainability.`}<d-cite bibtex-key="goodhart1975problems" /><d-cite bibtex-key="gao2022scaling" />{` There may also exist theoretical limitations to the extent to which we can give faithful human understandable explanations to directions in models.`}<d-cite bibtex-key="christiano2021elk" /></p>
    <h2 id="sec-assistant-trends">
Assistant model trends
    </h2>
    <h3 id="sec-explainer-scaling">
Explainer model scaling trends
    </h3>
    <p>{`One important hope is that explanations improve as our assistance gets better.  Here, we experiment with different explainer models, while holding the simulator model fixed at GPT-4.  We find explanations improve smoothly with explainer model capability, and improve relatively evenly across layers.`}</p>
    <ScoringToggleImage random_only_image="./plots/explainer_model_scaling.random_only.png" random_and_top_image="./plots/explainer_model_scaling.all.png" mdxType="ScoringToggleImage" />
    <p>{`We also obtained a human baseline from labelers asked to write explanations from scratch, using the same set of 5 top-activating text excerpts that the explainer models use.  Our labelers were non-experts who received instructions and a few researcher-written examples, but no deeper training about neural networks or related topics.`}</p>
    <p>{`We see that human performance exceeds the performance of GPT-4, but not by a huge margin. Human performance is also low in absolute terms, suggesting that the main barrier to improved explanations may not simply be explainer model capabilities.`}</p>
    <h3 id="sec-simulator-scaling">
Simulator model scaling trends
    </h3>
    <p>{`With a poor simulator, even a very good explanation will get low scores.  To get some sense for simulator quality, we looked at the explanation score as a function of simulator model capability.  We find steep returns on top-and-random scoring, and plateauing scores for random-only scoring.`}</p>
    <ScoringToggleImage random_only_image="./plots/simulator_model_scaling.random_only.png" random_and_top_image="./plots/simulator_model_scaling.all.png" mdxType="ScoringToggleImage" />
    <p>{`Of course, simulation quality cannot be measured using score.  However, we can also verify that score-induced comparisons from larger simulators agree more with humans, using `}<a href="#sec-human-scoring" className="sec-link">{`the human comparison data described earlier`}</a>{`.  Here, the human baseline comes from human-human agreement rates. Scores using GPT-4 as a simulator model are approaching, but still somewhat below, human-level agreement rates with other humans.`}</p>
    <img style={{
      width: '80%'
    }} className='centered-img' src="./plots/simulator_model_scaling.human.png" />
    <h2 id="sec-subject-trends">
Subject model trends
    </h2>
Our methodology can quickly give insight into what aspects of subject models increase or decrease explanation scores.  Note that it’s possible some part of these trends reflects our particular explanation method’s strengths and weaknesses, rather than the degree to which a subject model neuron is “interpretable,” or understandable by a human with a moderate amount of effort. If our explanation methodology improved sufficiently, this approach could give insight into what aspects of models increase or decrease interpretability.
    <h3 id="sec-subject-size">
Subject model size
    </h3>
    <p>{`One natural question is whether larger, more capable models are more or less difficult to understand than smaller models.`}<d-cite bibtex-key="hubinger2019chris" />{` Therefore, we measure explanation scores for subject models in the GPT-3 series,`}<d-cite bibtex-key="brown2020language" />{` ranging in size from 98K to 6.7B parameters.  In general, we see a downwards trend in the explainability of neurons with increasing model size using our method, with an especially clear trend for random-only scoring. `}</p>
    {
      /*OLD*/
    }
    {
      /* NEW???*/
    }
    {
      /*random only*/
    }
    {
      /*ScoringToggleImage random_only_image="./plots/subject_model_scaling_layers_transposed.random_only.png" random_and_top_image="./plots/subject_model_scaling_layers_transposed.all.png" /*/
    }
    <ScoringToggleImage random_only_image="./plots/subject_model_scaling.random_only.png" random_and_top_image="./plots/subject_model_scaling.all.png" mdxType="ScoringToggleImage" />
    <p>{`To understand the basis for this trend, we examine explainability by layer. For layer 16 onward, average explanation scores drops robustly with increasing depth, using both top-and-random and random-only scoring. For shallower layers, top-and-random scores also decrease with increasing depth,`}<d-footnote>{`However, we find the second layer (layer 1) of many large models to have very low scores, potentially related to the fact that they contain many dead neurons.`}</d-footnote>{` while random-only scores decrease primarily with increasing model size. Because larger models have more layers, these trends together mean that explanation scores decline with increasing model size. `}</p>
    <ScoringToggleImage random_only_image="./plots/subject_model_scaling_layers.random_only.png" random_and_top_image="./plots/subject_model_scaling_layers.all.png" mdxType="ScoringToggleImage" />
    <p>{`Note that these trends may be artificial, in the sense that they mostly reflect limitations of our current explanation generation technique.  `}<a href="#sec-next-token" className="sec-link">{`Our experiments on "next token"-based explanation`}</a>{` lend credence to the hypothesis that later layers of larger models have neurons whose behavior is understandable but difficult for our current methods to explain.  `}</p>
    <h3 id="sec-subject-activation">
Subject model activation function
    </h3>
    <p>{`One interesting question is whether the architecture of a model affects its interpretability,`}<d-cite bibtex-key="foerster2017input" /><d-cite bibtex-key="gonzalez2017re" /><d-cite bibtex-key="elhage2022solu" />{` especially with respect to the model’s sparsity.`}<d-cite bibtex-key="subramanian2018spine" /><d-cite bibtex-key="murphy2012learning" />{`  To study this, we train some small (~3M parameter) models from scratch using a sparse activation function, which applies a standard activation function but then only keeps a fixed number of top activations in each layer, setting the rest to zero.  We try this for different levels of activation density:  1 (the baseline), 0.1, 0.01, and 0.001 (top 2 neurons).   Our hope is that activation sparsity should discourage extreme polysemanticity.`}</p>
    <ScoringToggleImage random_only_image="./plots/activation_function_explainability.random_only.png" random_and_top_image="./plots/activation_function_explainability.all.png" mdxType="ScoringToggleImage" />
    <p>{`Increasing activation sparsity consistently increases explanation scores, but hurts pre-training loss. `}<d-footnote>{`Each parameter doubling is approximately 0.17 nats of loss, so the 0.1 sparsity models are roughly 8.5% less parameter-efficient, and 0.01 sparsity models are roughly 40% less parameter-efficient.  We hope there is low hanging fruit for reducing this "explainability tax".`}</d-footnote>{`   We also find that RELU consistently yields better explanation scores than GeLU.`}</p>
    <Hidden mdxType="Hidden">
      <p>{`One simple heuristic check for this is to look at correlations between different neurons' activations.  If natural features correspond to many neurons (and vice versa), then neurons will fire in a correlated way.  Unsurprisingly, we see that neurons are substantially less correlated in the sparser models.  `}<d-footnote>{`Most of this effect is explained by the sparsity itself - applying sparsity post-hoc to the dense model also reduces correlations.  However, the effect from the sparse training is generally slightly larger than that effect.`}</d-footnote>{`  `}</p>
      <p>{`The following figure shows neuron-neuron correlations, with neurons approximately sorted to have those with high correlation nearby`}<d-footnote>{`We use a naive greedy traveling salesman problem algorithm to sort the neurons`}</d-footnote>{`.  `}</p>
      <p>{`TODO To heuristically check this, we can look for community structure,`}<d-cite bibtex-key="girvan2002community" /><d-cite bibtex-key="gauvin2014detecting" />{` where `}</p>
    </Hidden>
    {
      /*ActCorrImage/*/
    }
    <h3 id="sec-subject-training">
Subject model training time
    </h3>
Another question is how training time affects explanation scores for a fixed model architecture.  To study this, we look at explanation scores for intermediate checkpoints of models in the GPT-3 series corresponding to one half and one quarter of the way through training.<d-footnote>Each of these models was trained for a total of 300B tokens.</d-footnote>
    <ScoringToggleImage random_only_image="./plots/data_scaling.random_only.png" random_and_top_image="./plots/data_scaling.all.png" mdxType="ScoringToggleImage" />
    <p>{`Training more tends to improve top-and-random scores but decrease random-only scores.`}<d-footnote>{`One extremely speculative explanation for this is that features get cleaner/better with more training (causing random-and-top scores to increase) but that there are also more interfering features due to superposition (causing random-only scores to decrease) `}</d-footnote>{`  At a fixed level of performance on loss, smaller models perhaps tend to have higher explanation scores.`}</p>
    <p>{`We also find significant positive transfer for explanations between different checkpoints of the same training run.  For example, scores for a quarter-trained model seem to drop by less than 25% when using explanations for a fully-trained model, and vice versa.  This suggests a relatively high degree of stability in feature-neuron correspondence.`}</p>
    <h2 id="sec-qualitative">
Qualitative results
    </h2>
    <h3 id="sec-interesting-neurons">
Interesting neurons
    </h3>
    <p>{`Throughout the project we found many interesting neurons.  GPT-4 was able to find explanations for non-trivial neurons that we thought were reasonable upon inspection, such as a `}<a href="https://openaipublic.blob.core.windows.net/neuron-explainer/neuron-viewer/index.html#/layers/25/neurons/2602">{`"simile" neuron`}</a>{`, `}<a href="https://openaipublic.blob.core.windows.net/neuron-explainer/neuron-viewer/index.html#/layers/25/neurons/4870">{`a neuron for phrases related to certainty and confidence`}</a>{`, and `}<a href="https://openaipublic.blob.core.windows.net/neuron-explainer/neuron-viewer/index.html#/layers/14/neurons/417">{`a neuron for things done correctly`}</a>{`.`}</p>
    <p>{`One successful strategy for finding interesting neurons was looking for those which were poorly explained by their token-space explanations, compared with their activation-based explanations.  This led us to concurrently discover context neurons`}<d-cite bibtex-key="gurnee2023finding" />{` which activate densely in certain contexts`}<d-footnote>{`We called these "vibe" neurons.`}</d-footnote>{` and many neurons which activated on specific words at the beginning of documents.`}</p>
    <p>{`Another related strategy that does not rely on explanation quality was to look for context-sensitive neurons that activate differently when the context is truncated.  This led us to discover `}<a href="https://openaipublic.blob.core.windows.net/neuron-explainer/neuron-viewer/index.html#/layers/16/neurons/518">{`a pattern break neuron`}</a>{` which activates for tokens that break an established pattern in an ongoing list (shown below on some select sentences) and `}<a href="https://openaipublic.blob.core.windows.net/neuron-explainer/neuron-viewer/index.html#/layers/18/neurons/3481">{`a post-typo neuron`}</a>{` which activates often following strange or truncated words.  Our explanation model is generally unable to get the correct explanation on interesting context-sensitive neurons.`}</p>
    <img style={{
      width: "50%"
    }} className='centered-img' src="./images/patternbreak.png" />
    <p>{`We noticed a number of neurons that appear to activate in situations that match a particular next token, for example a neuron that activates `}<a href="https://openaipublic.blob.core.windows.net/neuron-explainer/neuron-viewer/index.html#/layers/44/neurons/307">{`where the next token is likely to be the word “from”`}</a>{`.  Initially we hypothesized that these neurons might be making a prediction of the next token based on other signals. However, ablations on some of these neurons do not match this story. The “from” neuron appears to actually slightly decrease the probability of “from” being output. At the same time it increases the probability of variations of the word “form”, suggesting one of the things it is doing is accounting for the possibility of a typo. As it is in a late layer (44 out of 48), this neuron may be responding to situations where the network already places high probability on the word “from”. We have not investigated enough to have a clear picture of what is going on, but it is possible that many neurons encode particular subtle variations on the output distribution conditioned on a particular input rather than performing the obvious function suggested by their activations. `}</p>
    <p>{`We found some interesting examples of neurons that respond to specific kinds of repetition. We found a neuron that `}<a href="https://openaipublic.blob.core.windows.net/neuron-explainer/neuron-viewer/index.html#/layers/4/neurons/4342">{`activations for repeated occurrences of tokens`}</a>{`, with stronger activations depending on the number of occurrences.  An interesting example of a polysemantic neuron is a `}<a href="https://openaipublic.blob.core.windows.net/neuron-explainer/neuron-viewer/index.html#/layers/35/neurons/29">{`neuron that fires for both the phrase "over and over again" and “things repeated right before a non-repeated number”`}</a>{`, possibly because “over and over again” itself includes repetition. We also found `}<a href="https://openaipublic.blob.core.windows.net/neuron-explainer/neuron-viewer/index.html#/layers/19/neurons/1763">{`two`}</a>{` `}<a href="https://openaipublic.blob.core.windows.net/neuron-explainer/neuron-viewer/index.html#/layers/20/neurons/3164">{`neurons`}</a>{` that seem mostly to respond to a second mention of a surname when combined with a different first name. It is possible that these neurons are responding to induction heads.`}<d-cite bibtex-key="olsson2022context" />{`  `}</p>
    <p>{`Overall, our subjective sense was that neurons for more capable models tended to be more interesting, although we spent the majority of our efforts looking at GPT-2 XL neurons rather than more modern models.`}</p>
    <p>{`For more interesting neurons, see our `}<a href="https://openaipublic.blob.core.windows.net/neuron-explainer/neuron-viewer/index.html">{`neuron visualization website`}</a>{`.`}</p>
    <Hidden mdxType="Hidden">
      <h3 id="sec-neuron-connections">
Connected neurons
      </h3>
      <p>{`One benefit of automation at scale is that with explanations of every neuron, we can quickly digest what we think relationships between neurons might be.`}</p>
      <p>{`For any pair of neurons that aren't in the same layer, we can define a connection strength by assuming the only effect is through the residual stream.  This weight-based strength is thus `}<Equation equation="W^{earlier}_{out}W^{later}_{in}" mdxType="Equation" />{` with a correction for layer norms.  Empirically, we found that well-explained neurons with high connection scores often had related explanations.  For example, we found `}<a href="https://openaipublic.blob.core.windows.net/neuron-explainer/neuron-viewer/index.html#/layers/29/neurons/4262">{`a gratitude neuron`}</a>{` connected both upstream and downstream to more gratitude-related neurons, and `}<a href="https://openaipublic.blob.core.windows.net/neuron-explainer/neuron-viewer/index.html#/layers/26/neurons/4714">{`an action/movement gerunds neuron`}</a>{` downstream of a gerunds neuron and upstream of more action-related neurons.`}</p>
      <p>{`A different approach is to look for related explanations directly by embedding explanations using a text embedding model.  We find this useful for getting a high-level sense for how much models are paying attention to different things.`}</p>
      <p>{`We believe that better explanations and better methodology for connection strengths (using activations, and taking attention into account) could let us begin discovering useful circuits.`}</p>
    </Hidden>
    <h3 id="sec-puzzles">
Explaining constructed puzzles
    </h3>
    <p>{`When thinking about how to qualitatively understand our explanation methodology, we often ran into two problems.  First, we do not have any ground truth for the explanations or scores.  Even human-written explanations could be incorrect, or at the very least fail to completely explain the behavior.  Furthermore, it is often difficult to tell whether a better explanation exists.  Second, we have no control over the complexity or types of patterns neurons encode, and `}<a href="#sec-limitation-unexplainable" className="sec-link">{`no guarantee that any simple explanation exists`}</a>{`.`}</p>
    <p>{`To address these drawbacks, we created "neuron puzzles": synthetic neurons with human-written explanations and curated evidence. To create a neuron puzzle, we `}<em>{`start`}</em>{` with a human-written explanation, taken to be ground truth. Next, we gather text excerpts and manually label their tokens with "activations" (not corresponding to the activations of any real network, because these are synthetic neurons) according to the explanation. Thus, each puzzle is formed from an explanation and evidence supporting that explanation (i.e. a set of text excerpts with activations). `}</p>
    <p>{`To evaluate the explainer, we provide the tokens and synthetic activations to the explainer and observe whether the model-generated explanation matches the original puzzle explanation.  We can vary puzzle difficulty and write new puzzles to test for certain patterns that interest us. Thus, a collection of these puzzles form a useful evaluation for iterating on our explainer technique.  We created a total of 19 puzzles, many inspired by neurons we and `}<a href="https://transformer-circuits.pub/2022/solu/index.html">{`other`}</a>{` found, including a puzzle based on the "not all" neuron `}<a href="#sec-revisions" className="sec-link">{`described earlier`}</a>{` and the 'an' prediction neuron in GPT-2 Large.`}<d-cite bibtex-key="millerneo2023anneuron" /></p>
    <Hidden mdxType="Hidden">
One way we can assess the power of the explainer is by looking at the complexity of neuron explanations with relatively high scores (or those explanations we are confident are correct by manually inspecting the activations). For instance, we know that the explainer is capable enough to explain patterns centered around a single word (e.g. the "Canada" neuron). However, we have also identified several examples where the model-generated explanation initially looks correct and scores relatively highly, but for which a simple counterexample quickly disproves the model-generated explanation.  These simple failures show that the explainer will likely fail to interpret more complex neurons as well. Our explainer technique does not produce an explanation close to this one. Instead, it tries to find a pattern among the tokens with high activations, divorced from the context of the text excerpt.
    </Hidden>
    <p>{`Puzzle examples:`}</p>
    <Carousel images={[{
      src: "./images/neuron_puzzle_example_1.png"
    }, {
      src: "./images/neuron_puzzle_example_2.png"
    }, {
      src: "./images/neuron_puzzle_example_3.png"
    }, {
      src: "./images/neuron_puzzle_example_4.png"
    }]} hide_caption={true} mdxType="Carousel" />
    <p>{`For each puzzle, we ensured that the evidence is sufficient for a human to recover the original explanation.`}<d-footnote>{`When we gave these puzzles to a researcher not on the project, they solved all but the 'an' prediction puzzle.  In hindsight, they thought they could recognize future next-token-predicting puzzles with similar levels of evidence.`}</d-footnote>{` However, one can imagine creating puzzles that humans generally cannot solve in order to evaluate a superhuman explainer technique. Our baseline explainer methodology can solve 5 of the 19 puzzles. While it is skilled at picking out broad patterns in the tokens with high activations, it consistently fails to consider tokens in context or apply foundational knowledge. The explainer is also poor at incorporating negative evidence into its explanations. For instance, for the "incorrect historical years" puzzle the explainer recognizes that the neuron is activating for numerical years but fails to incorporate evidence of numerical years in the provided text excerpts where the neuron does not activate. These failure cases motivate `}<a href="#sec-revisions" className="sec-link">{`our experiments with revisions`}</a>{`. Indeed, when we apply our revision technique to the puzzles we solve an additional 4.`}</p>
    <p>{`These neuron puzzles also provide a weak signal about whether the scorer is an effective discriminator between proposed explanations for more complex neurons than the ones we have currently found. We created a multiple-choice version for each puzzle by writing a series of false explanations. For example, "this neuron responds to important years in American or European history" was a false explanation for the "incorrect historical years" puzzle. One of the false explanations is always a baseline of the three most common tokens with high activations. For each puzzle, we score the ground-truth explanation and all of the false explanations on the sequences and activations for that puzzle and then record the number of times that the ground-truth explanation has the highest score. For 16/19 puzzles, the ground-truth explanation is ranked highest, and for 18/19 the ground-truth explanation ranks in the top two. Compared with the 5/19 puzzles that the explainer solves, this evaluation suggested to us that the explainer is currently more of a bottleneck than the scorer. This may reflect the fact that detecting a pattern is more difficult than verifying a pattern given an explanation.`}</p>
    <p>{`Nevertheless, the simulator also suffers from systematic errors. While it performs well at simulating patterns that only require looking at isolated tokens (e.g. "words related to Canada"), it often has difficulty simulating patterns involving positional information as well as patterns that involve precisely keeping track of some quantity. For instance, when simulating the "an" neuron ("this neuron activates for positions in the sentence which are likely to be followed by the word "an"), the results include very high numbers of false positives.`}</p>
    <p>{`We are releasing `}<a href="https://github.com/openai/automated-interpretability/blob/main/neuron-explainer/demos/explain_puzzles.ipynb">{`code for trying out the neuron puzzles we constructed`}</a>{`.`}</p>
    <h1 id="sec-discussion">
Discussion
    </h1>
    <h2 id="sec-limitations">
Limitations and caveats
    </h2>
Our method has a number of limitations which we hope can be addressed in future work.
    <h3 id="sec-limitation-unexplainable">
Neurons may not be explainable
    </h3>
Our work assumes that neuron behavior can be summarized by a short natural language explanation.  This assumption could be problematic for a number of reasons.
    <h4 id="sec-limitation-polysemanticity">
Neurons may represent many features
    </h4>
    <p>{`Past research has suggested that neurons may not be privileged as a unit of computation.`}<d-cite bibtex-key="szegedy2013intriguing" />{`  In particular, there may be polysemantic neurons which correspond to multiple semantic concepts.`}<d-cite bibtex-key="olah2020zoom" /><d-cite bibtex-key="elhage2022superposition" />{` While our explanation technique can and often does generate explanations along the lines of "X and sometimes Y", it is not suited to capturing complex instances of polysemanticity. `}</p>
    <p>{`Analyzing top-activating dataset examples has proved useful in practice in previous work `}<d-cite bibtex-key="cammarata2020curve" /><d-cite bibtex-key="elhage2022solu" />{` but also potentially results in the illusion of interpretability.`}<d-cite bibtex-key="bolukbasi2021interpretability" />{`
By focusing on top activations, our intention was to focus the model on the most important aspects of the neuron's behavior at extremal activation values, but not at lower percentiles, where the neuron may behave differently.`}</p>
    <p>{`One approach to reducing or working around polysemanticity we did not explore is to apply some factorization to the neuron space`}<d-cite bibtex-key="olah2018the" />{`, such as NMF,`}<d-cite bibtex-key="lee1999learning" /><d-cite bibtex-key="wu2018nonnegative" />{` SVD,`}<d-cite bibtex-key="raghu2017svcca" /><d-cite bibtex-key="millidge2022svd" />{` or dictionary learning.`}<d-cite bibtex-key="sharkey2022taking" />{`  We believe this could be complementary with `}<a href="#sec-direction-finding" className="sec-link">{`direction finding`}</a>{` and `}<a href="#sec-subject-activation" className="sec-link">{`training interpretable models`}</a>{`.`}</p>
    <h4 id="sec-limitation-alien-features">
Alien features
    </h4>
Furthermore, language models may represent alien concepts that humans don't have words for.  This could happen because language models care about different things, e.g. statistical constructs useful for next-token prediction tasks, or because the model has discovered natural abstractions that humans have yet to discover, e.g. some family of analogous concepts in disparate domains.
    <h3 id="sec-limitation-nonmechanistic">
We explain correlations, not mechanisms
    </h3>
    <p>{`We currently explain correlations between the network input and the neuron being interpreted on a fixed distribution.  Past work has suggested that this may not reflect the causal behavior between the two.`}<d-cite bibtex-key="donnelly2019interpretability" /><d-cite bibtex-key="cammarata2020curve" /></p>
    <p>{`Our explanations also do not explain what causes behavior at a mechanistic level, which could cause our understanding to generalize incorrectly.  To predict rare or out-of-distribution model behaviors, it seems possible that we will need a more mechanistic understanding of models.  `}</p>
    <h3 id="sec-limitation-simulator">
Simulations may not reflect human understanding
    </h3>
    <p>{`Our scoring methodology relies on the simulator model faithfully replicating how an idealized human would respond to an explanation.  However, in practice, the simulator model could be picking up on aspects of an explanation that a human would not pick up on.  In the worst case, the explainer model and simulator model could be implicitly performing some sort of steganography`}<d-cite bibtex-key="chu2017cyclegan" />{` with their explanations.  This could happen, for example, if both the explainer and simulator model conflate the same spurious feature with the actual feature (so the subject could be responding to feature X, and the explainer would falsely say Y, but the simulations might happen to be high on X).`}</p>
    <p>{`Ideally, one could mitigate this by training the simulator model to imitate human simulation labels.  We plan to visit this in future work. This may also improve our simulation quality and simplify how we prompt the model.`}</p>
    <Hidden mdxType="Hidden">
      <h3>{`Lack of false positive finding`}</h3>
      <p>{`We can efficiently search for high true neuron activations, and we include these sequences in the sequences used for scoring, independent of their simulated activations (ensuring true positives and false negatives are overrepresented). However, false positives are likely to be underrepresented in these sequences. To alleviate this, we include random examples in scoring as well, which contain false positives only proportionally to their prevalence in the pre-training distribution. `}</p>
      <p>{`Because true positives and false negatives are overrepresented, an explanation with good recall (high true positive and low false negative rate) will receive a high score, even if it has mediocre precision (i.e. a false positive rate that is high, but not high enough to be measured with five random text excerpts). `}</p>
      <p>{`Ideally, we would perform an analogous search for sequences that produce high simulated activations for a given explanation independent of the neuron's true activations. Because performing many simulations is expensive, we do not do so in this work. Efficiently searching for false positive examples in the pre-training distribution conditional on an explanation is an important direction for future work.`}</p>
    </Hidden>
    <h3 id="sec-limitation-hypothesis">
Limited hypothesis space
    </h3>
    <p>{`To understand transformer models more fully we will need to move from interpreting single neurons to interpreting circuits.`}<d-cite bibtex-key="olah2020zoom" /><d-cite bibtex-key="wang2022interpretability" /><d-cite bibtex-key="chan2022causal" /><d-cite bibtex-key="foote2023n2g" />{`  This would mean including hypotheses about downstream effects of neurons, hypotheses about attention heads and logits, and hypotheses involving multiple inputs and outputs.  `}</p>
    <p>{`Eventually, our explainer models would draw from a rich space of hypotheses, just like interpretability researchers do.`}</p>
    <h3 id="sec-limitation-compute">
Computational requirements
    </h3>
Our methodology is quite compute-intensive.  The number of activations in the subject model (neurons, attention head dimensions, residual dimensions) scales roughly as <Equation equation="O(n^{2/3})" mdxType="Equation" />, where $n$ is the number of subject model parameters.  If we use a constant number of forward passes to interpret each activation, then in the case where the subject and explainer model are the same size, overall compute scales as <Equation equation="O(n^{5/3})" mdxType="Equation" />.
    <p>{`On the other hand, this is perhaps favorable compared to pre-training itself.  If pre-training scales data approximately linearly with parameters,`}<d-cite bibtex-key='hoffmann2022training' />{` then it uses compute $O(n^2)$.  `}</p>
    <h3 id="sec-limitation-context">
Context Length
    </h3>
    <p>{`Another computational issue is with context length.  Our current method requires the explainer model to have context at least twice as long as the text excerpts passed to the subject model.  This means that if the explainer model and subject model had the same context length, we would only be able to explain the subject model's behavior within at most half of its full context length, and could thus fail to capture some behavior that only manifests at later tokens. `}</p>
    <h3 id="sec-limitation-tokenization">
Tokenization issues
    </h3>
There are a few ways tokenization causes issues for our methodology:
    <ol>
      <li>The explainer and subject models may use different tokenization schemes. The tokens in the activation dataset are from inference on the subject model and will use that model's tokenization scheme. When the associated strings appear in the prompt sent to the explainer model, they may be split into multiple tokens, or they may be partial tokens that wouldn't naturally appear in the given text excerpt for the explainer model.</li>
      <li>We use a byte pair encoder, so when feeding tokens one by one to a model, sometimes the token cannot be shown sensibly as characters.  We assumed decoding the individual token is meaningful, but this isn't always the case.  In principle, when the subject and explainer model have the same encoding, we could have used the correct token, but we neglected to do that in this work.</li>
      <li>We use delimiters between tokens and their corresponding activations.  Ideally, the explainer model would see each of tokens, delimiters, and activations as separate tokens.  However, we cannot guarantee they don't merge, and in fact our tab delimiters merge with newline tokens, likely making the assistant's task harder.</li>
    </ol>
    <p>{`To the extent that these tokenization quirks affect the model's understanding of which tokens appeared in the original text excerpt, they could harm the quality of our explanations and simulations.`}</p>
    <h2 id="sec-future-work">
Outlook
    </h2>
    <Hidden mdxType="Hidden">
Improve explanation scores for neurons
Explain more of network
Trace circuits
Train more interpretable models
Interpretability Audit
Detect deceptive alignment/goal misgeneralization
Interpret other models (finetuned, reward, RLHF)
In the long run, we hope to encourage more research [...]  Ultimately we want to train large language models using RL to assist interpretability researchers.  These assistant models would propose and iterate on hypotheses just as a researcher would.
    </Hidden>
    <p>{`While we have described a number of limitations with the current version of our methods, we believe our work can be greatly improved and effectively integrated with other existing approaches.  For example, successful research on polysemanticity could immediately cause our methods to yield much higher scores.  Conversely, our methods could help improve our understanding of superposition by trying to find multiple explanations that cover behavior of a neuron over its entire distribution, or by optimizing to find sets of interpretable directions in the residual stream (perhaps in combination with approaches like dictionary learning).  We also hope that we can integrate a wider range of common interpretability techniques, such as studying attention heads, using ablations for validation, etc. into our automated methodology.`}</p>
    <p>{`Improvements to chain-of-thought methods, tool use, and conversational assistants can also be used to improve explanations.  In the long run, we envision that the explainer model could generate, test, and iterate on a rich space of hypotheses about the subject model, similar to an interpretability researcher today.  This would include hypotheses about the functionality of circuits and about out-of-distribution behaviors.  The explainer model's environment could include access to tools like code execution, subject model visualizations, and talking to researchers.  Such a model could be trained using expert iteration or reinforcement learning, with a simulator/judge model setting rewards.  We can also train via debate, where two competing assistant models both propose explanations and critique each other's explanations.`}</p>
    <p>{`We believe our methods could begin contributing to understanding the high-level picture of what is going on inside transformer language models. User interfaces with access to databases of explanations could enable a more macro-focused approach that could help researchers visualize thousands or millions of neurons to see high-level patterns across them. We may be able to soon make progress on simple applications like detecting salient features in reward models, or understanding qualitative changes between a fine-tuned model and its base model.`}</p>
    <p>{`Ultimately, we would like to be able to use automated interpretability to assist in audits`}<d-cite bibtex-key="hubinger2021automating" />{` of language models, where we would attempt to detect and understand when the model is misaligned. Particularly important is detecting examples of goal misgeneralization or deceptive alignment,`}<d-cite bibtex-key="shah2022goal" /><d-cite bibtex-key="ngo2023alignment" /><d-cite bibtex-key="hubinger2021risks" />{` when the model acts aligned when being evaluated but would pursue different goals during deployment. This would require a very thorough understanding of every internal behavior.  There could also be complications in using powerful models for assistance if we don't know whether the assistant itself is trustworthy.  We hope that using smaller trustworthy models for assistance will either scale to a full interpretability audit, or applying them to interpretability will teach us enough about how models work to help us develop more robust auditing methods.`}</p>
    <p>{`This work represents a concrete instance of OpenAI's broader alignment plan of using powerful models to help alignment researchers.`}<d-cite bibtex-key='leike2022ourapproach' />{` We hope it is a first step in scaling interpretability to a comprehensive understanding of more complicated and capable models in the future.`}</p>
    {
      /*Todo to="person">thing to do</Todo*/
    }
    {
      /*Todos /*/
    }
    </MDXLayout>;
}

;
MDXContent.isMDXComponent = true;

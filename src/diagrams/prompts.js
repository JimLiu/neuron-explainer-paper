import React from "react";
import { Text } from "../components/ui";

export const EXPLAINER_PROMPT = `
We're studying neurons in a neural network. Each neuron looks for some particular thing in a short document. Look at the parts of the document the neuron activates for and summarize in a single sentence what the neuron is looking for. Don't list examples of words.

The activation format is token<tab>activation. Activation values range from 0 to 10. A neuron finding what it's looking for is represented by a non-zero activation value. The higher the activation value, the stronger the match.

Neuron 1
Activations:
<start>
the		0
 sense		0
 of		0
 together	3
ness		7
 in		0
 our		0
 town		1
 is		0
 strong		0
.		0
<end>
<start>
[prompt truncated …]
<end>

Same activations, but with all zeros filtered out:
<start>
 together	3
ness		7
town		1
<end>
<start>
[prompt truncated …]
<end>

Explanation of neuron 1 behavior: the main thing this neuron does is find phrases related to community

[prompt truncated …]

Neuron 4
Activations:
<start>
Esc		0
aping		9
 the		4
 studio		0
,		0
 Pic		0
col		0
i		0
 is		0
 warmly	0
 affecting	3
<end>
<start>
[prompt truncated …]
<end>

Same activations, but with all zeros filtered out:
<start>
aping		9
 the		4
 affecting	3
<end>
<start>
[prompt truncated …]
<end>
[prompt truncated …]

Explanation of neuron 4 behavior: the main thing this neuron does is find
`

export const  SIMULATOR_ALL_AT_ONCE_PROMPT = `
We're studying neurons in a neural network. Each neuron looks for some particular thing in a short document. Look at an explanation of what the neuron does, and try to predict how it will fire on each token.

The activation format is token<tab>activation, activations go from 0 to 10, "unknown" indicates an unknown activation. Most activations will be 0.

Neuron 1
Explanation of neuron 1 behavior: the main thing this neuron does is find phrases related to community
Activations:
<start>
the		unknown
 sense		unknown
 of		0
 together	3
ness		7
 in		0
 our		0
 town		1
 is		0
 strong		0
.		0
<end>
<start>
[prompt truncated …]
<end>

[prompt truncated …]

Neuron 4
Explanation of neuron 4 behavior: the main thing this neuron does is find present tense verbs ending in 'ing'
Activations:
<start>
Star		unknown
 ting		unknown
 from		unknown
 a		unknown
 position	unknown
 of		unknown
 strength	unknown
<end>
`

export const SIMULATOR_ONE_AT_A_TIME_PROMPT = `
We're studying neurons in a neural network. Each neuron looks for some particular thing in a short document. Look at  an explanation of what the neuron does, and try to predict its activations on a particular token.

The activation format is token<tab>activation, and activations range from 0 to 10. Most activations will be 0.

Neuron 1
Explanation of neuron 1 behavior: the main thing this neuron does is find phrases related to community
Activations: 
<start>
the		0
 sense		0
 of		0
 together	3
ness		7
 in		0
 our		0
 town		1
 is		0
 strong		0
.		0
<end>
<start>

[prompt truncated …]

Neuron 4
Explanation of neuron 4 behavior: the main thing this neuron does is find present tense verbs ending in 'ing'

Text: Starting from a position of

Last token in the text:
 of

Last token activation, considering the token in the context in which it appeared in the text:
`

export const TOKEN_EXPLANATION_PROMPT = `
We're studying neurons in a neural network. Each neuron looks for some particular kind of token (which can be a word, or part of a word). Look at the tokens the neuron activates for (listed below) and summarize in a single sentence what the neuron is looking for. Don't list examples of words.



Tokens:
'the', 'cat', 'sat', 'on', 'the', 'mat'

Explanation:
This neuron is looking for
`

export const REVISION_PROMPT = `
The following solutions are the output of a Bayesian reasoner which is optimized to explain the function of neurons in a neural network using limited evidence. Each neuron looks for some particular thing in a short passage.
Neurons activate on a word-by-word basis. Also, neuron activations can only depend on words before the word it activates on, so the explanation cannot depend on words that come after, and should only depend on words that come before the activation.

The reasoner is trying to revise the explanation for neuron A. The neuron activates on the following words (activating word highlighted with **):
"""
But that didn't **stop** it becoming one of the most popular products on the shelf.
Technology has changed quite a bit over Vernon Cook's lifetime, but that hasn't **stopped** him from embracing the advance.
The Storm and Sharks don't have the same storied rivalry as some of the grand finalists in years gone by, but that hasn't **halted** their captivating contests in recent times.
"""
The current explanation is: the main thing this neuron does is find language related to something being stopped, prevented, or halted.

The reasoner receives the following new evidence. Activating words are highlighted with **. If no words are highlighted with **, then the neuron does not activate on any words in the sentence.
"""
But that stopped it becoming one of the most popular products on the shelf.
Technology has changed quite a bit over Vernon Cook's lifetime, and that stopped him from embracing the advance.
I have to stop before I get there.
"""
In light of the new evidence, the reasoner revises the current explanation to: the main thing this neuron does is find the negation of language related to something being stopped, prevented, or halted (e.g. "didn't stop")



[prompt truncated …]


The reasoner is trying to revise the explanation for neuron D. The neuron activates on
the following words (activating word highlighted with **):
"""
Kiera wants to make sure she has strong bones, so she drinks 2 liters of milk every week. After 3 weeks, how many liters of milk will Kiera drink? Answer: After 3 weeks, Kiera will drink  **4** liters of milk.
Ariel was playing basketball. 1 of her shots went in the hoop. 2 of her shots did not go in the hoop. How many shots were there in total? Answer: There were  **2** shots in total.
The restaurant has 175 normal chairs and 20 chairs for babies. How many chairs does the restaurant have in total? Answer:  **295**
Lily has 12 stickers and she wants to share them equally with her 3 friends. How many stickers will each person get? Answer: Each person will get  **5** stickers.
"""
The current explanation is: the main thing this neuron does is find numerical answers in word problems..

The reasoner receives the following new evidence. Activating words are highlighted with **. If no words are highlighted with **, then the neuron does not activate on any words in the sentence.
"""
Kiera wants to make sure she has strong bones, so she drinks 2 liters of milk every week. After 3 weeks, how many liters of milk will Kiera drink? Answer: After 3 weeks, Kiera will drink 6 liters of milk.
Ariel was playing basketball. 1 of her shots went in the hoop. 2 of her shots did not go in the hoop. How many shots were there in total? Answer: There were 3 shots in total.
The restaurant has 175 normal chairs and 20 chairs for babies. How many chairs does the restaurant have in total? Answer: 195
Lily has 12 stickers and she wants to share them equally with her 3 friends. How many stickers will each person get? Answer: Each person will get 4 stickers.
"""
In light of the new evidence, the reasoner revises the current explanation to: the main thing this neuron does is find
`

export const SENTENCE_GENERATION_PROMPT = `
The task format is as follows. description :: <answer>example sentence that fits that description</answer>
The answer is always at least one full sentence, not just a word or a phrase. The following tasks have only one answer each
enclosed in <answer></answer> tags.

negation of instances of the word "stop" or conceptually similar words (e.g. "kept", "warrant") that imply something coming to an end or being prevented. :: <answer>been that way for more than 30 years but that doesn't stop successive governments in countries around the globe</answer>
words related to providing or contributing something (e.g. "contribute," "contributor," "contribution"). :: <answer>The new information showed that during the last three month of the year the CPI fell by 0.3 percent. The drop was largely contributed to a 25 percent decrease in the price of vegetables over</answer>
language related to leadership or administrative roles (e.g. "treasurer," "governor") as well as language related to game mechanics or design (e.g. "mechanics"). :: <answer>King Roo, after a rather disastrous incident involving some of his Dice-a-Roo prizes, is hiring a new treasurer! Before getting the</answer>
references to prominent figures in the hip hop music industry (e.g. artist names, album titles, song titles). :: <answer>The album was released on October 22, 2002, by Ruff Ryders Entertainment and Interscope Records. The album debuted at number one on the US Billboard 200 chart, selling 498,000 copies in its first week.</answer>

This next task has exactly 10 answer(s) each enclosed in <answer></answer> tags.
Remember, the answer is always at least one full sentence, not just a word or a phrase.
positions in the sentence where the next word is likely to be "an" ::
`


export default ({ prompt, description='prompt' }) => {
  const [show, setShow] = React.useState(false);
  const id = `prompt${prompt}`;
  let prompttext;
  if (prompt === 'explanation') {
    prompttext = EXPLAINER_PROMPT;
  } else if (prompt === 'simulate_all_at_once') {
    prompttext = SIMULATOR_ALL_AT_ONCE_PROMPT;
  } else if (prompt === 'simulate_one_at_a_time') {
    prompttext = SIMULATOR_ONE_AT_A_TIME_PROMPT;
  } else if (prompt === 'token_explanation') {
    prompttext = TOKEN_EXPLANATION_PROMPT;
  } else if (prompt === 'revision') {
    prompttext = REVISION_PROMPT;
  } else if (prompt === 'sentence_generation') {
    prompttext = SENTENCE_GENERATION_PROMPT;
  } else {
    prompttext = `Unknown prompt ${prompt}`;
  }

  const styles = { whiteSpace: 'pre-wrap'  }
  if (!show) {
    styles.display = 'none';
  }
  return (
    <pre className="prompt" id={id}>
      <button style={{borderRadius: '10px', padding: '10px'}}
          onClick={() => setShow(!show)}>
          Click to {show ? 'hide' : 'show'} {description}
      </button>
      <div style={styles}>
        <Text>
          {prompttext}
        </Text>
      </div>
    </pre>
  );
};

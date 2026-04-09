//lista de historico
const historico = [];

//converte unidade de tempo para fator em dias
const unidadeParaFator = {
  'Dia': 1,
  'Mês': 30,
  'Ano': 365
};

//alternar páginas
function showPage(pageName) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.getElementById(pageName).classList.add('active');
  
  document.querySelectorAll('.nav-btn').forEach(btn => btn.classList.remove('active'));
  event.target.classList.add('active');
}


//Adicionar ao histórico e limitar a 50 historicos
function adicionarAoHistorico(operacao, resultado) {
  const agora = new Date().toLocaleTimeString('pt-BR');
  historico.unshift({
    operacao,
    resultado,
    hora: agora
  });
  
  //remove o mais antigo se passar de 50
  if(historico.length > 50) {
    historico.pop();
  }
  //chama a função atualizarHistorico
  atualizarHistorico();
}

//Atualizar a lista de histórico na interface
function atualizarHistorico() {
  const lista = document.getElementById('historico-list');
  if(!lista) return;
  
  //monta o HTML de cada item do historico
  lista.innerHTML = historico.map((h, i) => `
    <div class="historico-item">
      <strong>${h.operacao}</strong><br>
      ${h.resultado.substring(0, 50)}...<br>
      <small>${h.hora}</small>
    </div>
  `).join('');
  
  //atualiza o total e a ultima operação no resumo
  document.getElementById('total-calc').textContent = historico.length;
  if(historico.length > 0) {
    document.getElementById('ultima-op').textContent = historico[0].operacao;
  }
}

//apagar histórico
function limparHistorico() {
  historico.length = 0;
  atualizarHistorico();
}

//converte tempo de uma unidade pra outra usando dias como base
function converterTempo(tempo, deUnidade, paraUnidade) {
  const fatoresUnidades = { 'Dia': 1, 'Mês': 30, 'Ano': 365 };
  const tempoEmDias = tempo * fatoresUnidades[deUnidade];
  return tempoEmDias / fatoresUnidades[paraUnidade];
}

//exibe o resultado na tela, com classe de erro se precisar
function mostrarResultado(elementId, conteudo, ehErro = false) {
  const elem = document.getElementById(elementId);
  elem.innerHTML = conteudo;
  elem.classList.add('show');
  //adiciona ou remove classe de erro
  if(ehErro) {
    elem.classList.add('erro');
  } else {
    elem.classList.remove('erro');
  }
}

//calcula juros compostos - reinvestimento de lucros
function calcularJurosCompostos() {
  //pega os valores do formulário
  const capital = parseFloat(document.getElementById('jc-capital').value);
  const taxa = parseFloat(document.getElementById('jc-taxa').value) / 100;
  const tempo = parseFloat(document.getElementById('jc-tempo').value);

  //valida se os valores são números positivos
  if(isNaN(capital) || isNaN(taxa) || isNaN(tempo) || capital < 0 || taxa < 0 || tempo < 0) {
    mostrarResultado('jc-resultado', '<h3>Erro</h3><p>Valores inválidos</p>', true);
    return;
  }

  //fórmula de juros compostos: M = C(1+i)^t
  const montante = capital * Math.pow(1 + taxa, tempo);
  const juros = montante - capital;

  //monta o HTML do resultado
  const resultado = `
    <h3>Resultado do Reinvestimento</h3>
    <p><strong>Lucro Inicial:</strong> R$ ${capital.toFixed(2)}</p>
    <p><strong>Taxa de Retorno:</strong> ${(taxa * 100).toFixed(2)}% ao mês</p>
    <p><strong>Período:</strong> ${tempo.toFixed(2)} meses</p>
    <p><strong>Juros Gerados:</strong> R$ ${juros.toFixed(2)}</p>
    <div class="resultado-valor">Montante Total: R$ ${montante.toFixed(2)}</div>
    <p style="margin-top: 15px; font-size: 0.9rem; color: #666;"><em>Se reinvestir R$ ${capital.toFixed(2)} de lucro mensal a ${(taxa * 100).toFixed(2)}% ao mês, você terá R$ ${montante.toFixed(2)} em ${tempo.toFixed(0)} meses.</em></p>
  `;
  mostrarResultado('jc-resultado', resultado);
  adicionarAoHistorico('Juros Compostos', `Capital: R$ ${capital.toFixed(2)} → Montante: R$ ${montante.toFixed(2)}`);
}

//calcula juros simples - financiamento de caminhão
function calcularJurosSimples() {
  //pega os valores do formulário
  const capital = parseFloat(document.getElementById('js-capital').value);
  const taxa = parseFloat(document.getElementById('js-taxa').value) / 100;
  const tempo = parseFloat(document.getElementById('js-tempo').value);

  //valida se os valores são números positivos
  if(isNaN(capital) || isNaN(taxa) || isNaN(tempo) || capital < 0 || taxa < 0 || tempo < 0) {
    mostrarResultado('js-resultado', '<h3>Erro</h3><p>Valores inválidos</p>', true);
    return;
  }

  //fórmula de juros simples: J = C*i*t e M = C + J
  const juros = capital * taxa * tempo;
  const montante = capital + juros;

  //monta o HTML do resultado
  const resultado = `
    <h3>Resultado do Financiamento</h3>
    <p><strong>Valor do Caminhão:</strong> R$ ${capital.toFixed(2)}</p>
    <p><strong>Taxa de Juros:</strong> ${(taxa * 100).toFixed(2)}% ao mês</p>
    <p><strong>Prazo:</strong> ${tempo.toFixed(0)} meses</p>
    <p><strong>Total em Juros:</strong> R$ ${juros.toFixed(2)}</p>
    <div class="resultado-valor">Valor Total a Pagar: R$ ${montante.toFixed(2)}</div>
    <p style="margin-top: 15px; font-size: 0.9rem; color: #666;"><em>Você pagará R$ ${juros.toFixed(2)} a mais no total do financiamento.</em></p>
  `;
  mostrarResultado('js-resultado', resultado);
  adicionarAoHistorico('Juros Simples', `Capital: R$ ${capital.toFixed(2)} → Montante: R$ ${montante.toFixed(2)}`);
}

//calcula equação de 1º grau - ponto de equilíbrio de fretes
function calcularEq1Grau() {
  //pega os valores do formulário
  const a = parseFloat(document.getElementById('eq1-a').value);
  const b = parseFloat(document.getElementById('eq1-b').value);
  
  //a não pode ser zero (senão não é equação)
  if(isNaN(a) || isNaN(b) || a === 0) {
    mostrarResultado('eq1-resultado', '<h3>Erro</h3><p>Coeficiente a não pode ser zero</p>', true);
    return;
  }
  
  //x = -b/a
  const x = -b / a;
  
  //monta o HTML do resultado
  const resultado = `
    <h3>Ponto de Equilíbrio</h3>
    <p><strong>Ganho por Frete:</strong> R$ ${a.toFixed(2)}</p>
    <p><strong>Custos Fixos Mensais:</strong> R$ ${Math.abs(b).toFixed(2)}</p>
    <p><strong>Cálculo:</strong> ${a}x + (${b}) = 0 → x = ${-b} / ${a}</p>
    <div class="resultado-valor">Fretes Necessários: ${Math.ceil(x)}</div>
    <p style="margin-top: 15px; font-size: 0.9rem; color: #666;"><em>Você precisa fazer ${Math.ceil(x)} fretes por mês para cobrir os custos fixos.</em></p>
  `;
  
  mostrarResultado('eq1-resultado', resultado);
  adicionarAoHistorico('Equação 1º Grau', `${a}x + ${b} = 0 → x = ${x.toFixed(4)}`);
}

//calcula equação de 2º grau - otimização de rotas
function calcularEq2Grau() {
  //pega os valores do formulário
  const a = parseFloat(document.getElementById('eq2-a').value);
  const b = parseFloat(document.getElementById('eq2-b').value);
  const c = parseFloat(document.getElementById('eq2-c').value);
  
  //a não pode ser zero
  if(isNaN(a) || isNaN(b) || isNaN(c) || a === 0) {
    mostrarResultado('eq2-resultado', '<h3>Erro</h3><p>O campo "Custo por distância percorrida²" não pode ser zero.</p>', true);
    return;
  }
  
  //calcula o delta (discriminante)
  const delta = b * b - 4 * a * c;
  
  //começa a montar o resultado com os dados da rota
  let resultado = `
    <h3>Análise da Rota</h3>
    <p><strong>Custo por distância²:</strong> ${a}</p>
    <p><strong>Custo/desconto por KM:</strong> ${b}</p>
    <p><strong>Custo fixo da rota:</strong> R$ ${c.toFixed(2)}</p>
    <hr style="margin: 10px 0; border-color: #e0e0e0">
  `;
  
  if(delta > 0) {
    //dois pontos de equilíbrio
    const x1 = (-b + Math.sqrt(delta)) / (2 * a);
    const x2 = (-b - Math.sqrt(delta)) / (2 * a);
    const menor = Math.min(x1, x2).toFixed(2);
    const maior = Math.max(x1, x2).toFixed(2);
    resultado += `
      <p> <strong>A rota tem dois pontos de equilíbrio de custo:</strong></p>
      <div class="resultado-valor">
        Ponto A: ${menor} km<br>
        Ponto B: ${maior} km
      </div>
      <p style="margin-top: 15px; font-size: 0.9rem; color: #666;">
        <em>Significa que o custo total da rota se iguala a zero (se equilibra) aos <strong>${menor} km</strong> e aos <strong>${maior} km</strong>.
        Entre essas duas distâncias, a rota pode ser vantajosa. Fora delas, o custo supera o previsto.</em>
      </p>
    `;
    adicionarAoHistorico('Otimização de Rotas', `Pontos de equilíbrio: ${menor} km e ${maior} km`);
  } else if(delta === 0) {
    //um único ponto de equilíbrio
    const x = (-b / (2 * a)).toFixed(2);
    resultado += `
      <p><strong>A rota tem um único ponto de equilíbrio:</strong></p>
      <div class="resultado-valor">Distância ótima: ${x} km</div>
      <p style="margin-top: 15px; font-size: 0.9rem; color: #666;">
        <em>O custo da rota se equilibra exatamente aos <strong>${x} km</strong>. Qualquer distância diferente gera custo adicional.</em>
      </p>
    `;
    adicionarAoHistorico('Otimização de Rotas', `Ponto único: ${x} km`);
  } else {
    //nenhuma solução real
    resultado += `
      <p><strong>Nenhum ponto de equilíbrio encontrado.</strong></p>
      <p style="font-size: 0.9rem; color: #666;">
        <em>Com esses valores de custo, não existe distância em que o custo da rota se zera. Revise os valores informados — talvez os custos fixos estejam muito altos para essa rota.</em>
      </p>
    `;
    adicionarAoHistorico('Otimização de Rotas', 'Nenhum ponto de equilíbrio encontrado');
  }
  
  mostrarResultado('eq2-resultado', resultado);
}

//calcula inequação de 1º grau - viabilidade do frete
function calcularIneq1Grau() {
  //pega os valores do formulário
  const a = parseFloat(document.getElementById('ineq1-a').value);
  const b = parseFloat(document.getElementById('ineq1-b').value);
  
  //a não pode ser zero
  if(isNaN(a) || isNaN(b) || a === 0) {
    mostrarResultado('ineq1-resultado', '<h3>Erro</h3><p>Coeficiente a não pode ser zero</p>', true);
    return;
  }
  
  //calcula o ponto onde o lucro é zero
  const ponto = -b / a;
  let solucao, simbolo;
  
  //define o sinal da solução conforme o sinal de a
  if(a > 0) {
    solucao = `x > ${ponto.toFixed(2)} km`;
    simbolo = '>';
  } else {
    solucao = `x < ${ponto.toFixed(2)} km`;
    simbolo = '<';
  }
  
  //monta o HTML do resultado
  const resultado = `
    <h3>Viabilidade do Frete</h3>
    <p><strong>Ganho por KM:</strong> R$ ${a.toFixed(2)}</p>
    <p><strong>Custo Fixo:</strong> R$ ${Math.abs(b).toFixed(2)}</p>
    <p><strong>Inequação:</strong> ${a}x + (${b}) > 0</p>
    <div class="resultado-valor">Frete Lucrativo: ${solucao}</div>
    <p style="margin-top: 15px; font-size: 0.9rem; color: #666;"><em>O frete é lucrativo apenas para distâncias ${simbolo.toLowerCase()} ${ponto.toFixed(2)} km.</em></p>
  `;
  
  mostrarResultado('ineq1-resultado', resultado);
  adicionarAoHistorico('Inequação 1º Grau', `${a}x + ${b} > 0 → ${solucao}`);
}

//calcula inequação de 2º grau - faixa de lucratividade
function calcularIneq2Grau() {
  //pega os valores do formulário
  const a = parseFloat(document.getElementById('ineq2-a').value);
  const b = parseFloat(document.getElementById('ineq2-b').value);
  const c = parseFloat(document.getElementById('ineq2-c').value);
  
  //a não pode ser zero
  if(isNaN(a) || isNaN(b) || isNaN(c) || a === 0) {
    mostrarResultado('ineq2-resultado', '<h3>Erro</h3><p>O primeiro campo não pode ser zero.</p>', true);
    return;
  }
  
  //calcula o delta
  const delta = b * b - 4 * a * c;
  
  //começa o resultado com os dados do frete
  let resultado = `
    <h3>Faixa de Lucratividade da Rota</h3>
    <p><strong>Ganho por KM:</strong> R$ ${b.toFixed(2)}</p>
    <p><strong>Lucro total considerado:</strong> R$ ${c.toFixed(2)}</p>
    <hr style="margin: 10px 0; border-color: #e0e0e0">
  `;
  
  if(delta < 0) {
    if(a > 0) {
      //sem raízes reais com a positivo = sempre lucrativo
      resultado += `
        <div class="resultado-valor">A rota é lucrativa em qualquer distância</div>
        <div style="margin-top: 16px; background: #f0fdf4; border-left: 4px solid #22c55e; padding: 14px 16px; border-radius: 6px; font-size: 0.92rem; color: #166534;">
          <strong>Como ler este resultado:</strong><br><br>
          A rota é lucrativa em <strong>qualquer distância</strong>. Não importa quantos quilômetros o caminhão rodar nessa rota — os ganhos sempre superam os custos. Você pode aceitar esse frete com tranquilidade.
        </div>
      `;
      adicionarAoHistorico('Faixa de Lucratividade', 'Lucrativa em qualquer distância');
    } else {
      //sem raízes reais com a negativo = nunca lucrativo
      resultado += `
        <div class="resultado-valor" style="background: #fee2e2; color: #991b1b;">Rota não é lucrativa em nenhuma distância</div>
        <div style="margin-top: 16px; background: #fef2f2; border-left: 4px solid #ef4444; padding: 14px 16px; border-radius: 6px; font-size: 0.92rem; color: #991b1b;">
          <strong>Como ler este resultado:</strong><br><br>
          A rota <strong>não é lucrativa em nenhuma distância</strong>. Com esses custos e ganhos, o frete nunca cobre as despesas. Revise o valor cobrado por KM ou reduza os custos fixos antes de aceitar essa rota.
        </div>
      `;
      adicionarAoHistorico('Faixa de Lucratividade', 'Nenhuma distância lucrativa');
    }
  } else if(delta === 0) {
    //raiz dupla: um único ponto onde o lucro é zero
    const x = -b / (2 * a);
    if(a > 0) {
      resultado += `
        <div class="resultado-valor">Lucrativa em qualquer distância, exceto ${x.toFixed(2)} km</div>
        <div style="margin-top: 16px; background: #fffbeb; border-left: 4px solid #f59e0b; padding: 14px 16px; border-radius: 6px; font-size: 0.92rem; color: #92400e;">
          <strong>Como ler este resultado:</strong><br><br>
          A rota é lucrativa em <strong>qualquer distância, exceto exatamente ${x.toFixed(2)} km</strong>. Nessa distância específica o lucro é zero — em qualquer outra distância, o frete vale a pena.
        </div>
      `;
      adicionarAoHistorico('Faixa de Lucratividade', `Lucrativa exceto em ${x.toFixed(2)} km`);
    } else {
      resultado += `
        <div class="resultado-valor" style="background: #fee2e2; color: #991b1b;">Rota não é lucrativa em nenhuma distância</div>
        <div style="margin-top: 16px; background: #fef2f2; border-left: 4px solid #ef4444; padding: 14px 16px; border-radius: 6px; font-size: 0.92rem; color: #991b1b;">
          <strong>Como ler este resultado:</strong><br><br>
          A rota <strong>não é lucrativa em nenhuma distância</strong>. Considere renegociar o valor do frete ou reduzir custos fixos da rota.
        </div>
      `;
      adicionarAoHistorico('Faixa de Lucratividade', 'Nenhuma distância lucrativa');
    }
  } else {
    //duas raízes distintas: define a faixa lucrativa
    const x1 = (-b - Math.sqrt(delta)) / (2 * a);
    const x2 = (-b + Math.sqrt(delta)) / (2 * a);
    const menor = Math.min(x1, x2);
    const maior = Math.max(x1, x2);
    
    if(a > 0) {
      //com a positivo: lucrativo fora da faixa
      resultado += `
        <div class="resultado-valor">Lucrativa abaixo de ${menor.toFixed(2)} km ou acima de ${maior.toFixed(2)} km</div>
        <div style="margin-top: 16px; background: #fffbeb; border-left: 4px solid #f59e0b; padding: 14px 16px; border-radius: 6px; font-size: 0.92rem; color: #92400e;">
          <strong>Como ler este resultado:</strong><br><br>
          A rota é lucrativa somente para distâncias <strong>menores que ${menor.toFixed(2)} km</strong> ou <strong>maiores que ${maior.toFixed(2)} km</strong>.<br><br>
          Entre <strong>${menor.toFixed(2)} km e ${maior.toFixed(2)} km</strong> os custos superam os ganhos — evite aceitar fretes nessa faixa de distância.
        </div>
      `;
      adicionarAoHistorico('Faixa de Lucratividade', `x < ${menor.toFixed(2)} km ou x > ${maior.toFixed(2)} km`);
    } else {
      //com a negativo: lucrativo dentro da faixa
      resultado += `
        <div class="resultado-valor">Lucrativa entre ${menor.toFixed(2)} km e ${maior.toFixed(2)} km</div>
        <div style="margin-top: 16px; background: #d1baecff; border-left: 4px solid #6122c5ff; padding: 14px 16px; border-radius: 6px; font-size: 0.92rem; color: #381665ff;">
          <strong>Como ler este resultado:</strong><br><br>
          A rota gera lucro quando a distância percorrida estiver <strong>entre ${menor.toFixed(2)} km e ${maior.toFixed(2)} km</strong>.<br><br>
          Abaixo de <strong>${menor.toFixed(2)} km</strong> o frete não cobre os custos. Acima de <strong>${maior.toFixed(2)} km</strong> os gastos começam a superar os ganhos.<br><br>
          Prefira aceitar fretes dentro dessa faixa de distância para garantir lucro.
        </div>
      `;
      adicionarAoHistorico('Faixa de Lucratividade', `Lucrativa entre ${menor.toFixed(2)} km e ${maior.toFixed(2)} km`);
    }
  }
  
  mostrarResultado('ineq2-resultado', resultado);
}

//calcula operações com conjuntos - rotas e clientes
function calcularConjuntos() {
  //pega e limpa os itens das rotas A e B
  const conjA = document.getElementById('conj-a').value
    .split(',')
    .map(e => e.trim())
    .filter(e => e);
  
  const conjB = document.getElementById('conj-b').value
    .split(',')
    .map(e => e.trim())
    .filter(e => e);
  
  //pega a operação escolhida
  const operacao = document.getElementById('conj-op').value;
  let resultado;
  
  //executa a operação selecionada
  if(operacao.includes('União')) {
    //todos os clientes das duas rotas, sem repetição
    resultado = [...new Set([...conjA, ...conjB])];
  } else if(operacao.includes('Interseção')) {
    //clientes que aparecem nas duas rotas
    resultado = conjA.filter(e => conjB.includes(e));
  } else if(operacao.includes('A - B')) {
    //clientes só da rota A
    resultado = conjA.filter(e => !conjB.includes(e));
  } else if(operacao.includes('B - A')) {
    //clientes só da rota B
    resultado = conjB.filter(e => !conjA.includes(e));
  } else if(operacao.includes('Simétrica')) {
    //clientes que estão em uma rota mas não na outra
    const aMinusB = conjA.filter(e => !conjB.includes(e));
    const bMinusA = conjB.filter(e => !conjA.includes(e));
    resultado = [...aMinusB, ...bMinusA];
  }
  
  //monta o HTML do resultado
  const html = `
    <h3>Resultado</h3>
    <p><strong>Conjunto A:</strong> {${conjA.join(', ')}}</p>
    <p><strong>Conjunto B:</strong> {${conjB.join(', ')}}</p>
    <p><strong>Operação:</strong> ${operacao}</p>
    <div class="resultado-valor">{${resultado.join(', ')}}</div>
  `;
  
  mostrarResultado('conj-resultado', html);
  adicionarAoHistorico('Conjuntos', `${operacao}: {${resultado.join(', ')}}`);
}



//quando a página carregar, atualiza o histórico
document.addEventListener('DOMContentLoaded', () => {
  atualizarHistorico();
});

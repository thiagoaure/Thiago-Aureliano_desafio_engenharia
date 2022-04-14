let readlineSync = require('readline-sync');
const pacotes = require('./pacotes.js');

// Menu de Opcoes
const Menu = () => {
    console.log('\n');
    console.log('1 - Identificar a região de destino de cada pacote, com totalização de pacotes \n');
    console.log('2 - Saber quais pacotes possuem códigos de barras válidos e/ou inválidos\n');
    console.log('3 - Identificar os pacotes que têm como origem a região Sul e Brinquedos em seu conteúdo\n');
    console.log('4 - Listar os pacotes válidos agrupados por região de destino\n');
    console.log('5 - Listar o número de pacotes válidos enviados por cada vendedor\n');
    console.log('6 - Gerar o relatório/lista de pacotes validos por destino e por tipo\n');
    console.log('7 - Se o transporte dos pacotes para o Norte passa pela Região Centro-Oeste, quais são os\n' +
    ' pacotes que devem ser despachados nomesmo caminhão\n');
    console.log('8 - Se todos os pacotes fossem uma fila qual seria a ordem de carga para o Norte no caminhão para\n ' +
    'descarregar os pacotes da Região Centro Oeste primeiro\n');
    console.log('9 -  Listar os pacotes inválidos\n ');
    console.log('10 - SAIR DO MENU\n');
}

// Executa Opcoes de consulta
const Main = () => {
    Menu();
    let option = parseInt(readlineSync.question('\nEscolha acima a opcao desejada: \n'));
    while (option != 10){
        switch(option){
            case 1:
                localizaRegiao(3, 6);   
                imprimePacotesPorRegiao();
                break;
            case 2:
                listaPacotesSeprados();
                break;
            case 3:
                localizaRegiao(0, 3);
                listaPacotesNoSulcomBrinquedos();
                break;
            case 4:
                listaDestinoETipo();
                break;
            case 5:
                listaPacotesVendedor();
                break;
            case 6:
                listaDestinoETipo();
                break;
            case 7:
                caminhaoCentroeNorte();
                break;
            case 8:
                OrdenaCargaDosPacotes();
                break;
            case 9:
                listaPacotesInvalidos();
                break;
            case 10:
            // sair
                break;
            default:
                console.log('Opção Inválida, digite novamente');    
        }
        Menu(); 
        option = parseInt(readlineSync.question('\nEscolha a opcao desejada: \n'));
        cleanArrays();
    }
}

// Funcoes para verificacao da trinca e regras de negocio
const verificaRegiao = (trinca) => {
    if(trinca >= 201 && trinca <= 499) {
        return true;
    } else if (trinca >= 001 && trinca <= 199 ) {
        return true;
    }
    return false;
}

const verificaCodLoggi = (trinca) => {
    if (trinca !== 555) {
        return false;
    }
    return true;
}

const verificaCodVendedor = (trinca) => {
    if (trinca === 367){
        return false;
    }
    return true;
}

const verificaTipoProduto = (trinca) => {
    if(trinca === 001){
        return true;
    } else if (trinca === 111) {
        return true;
    } else if (trinca  === 333)  {
        return true;
    } else if (trinca === 555 ) {
        return true;
    } else if (trinca === 888){
        return true;
    }
    return false;
}

const verificaJoiasNoCentroOeste = (trinca, codigo) => {
    let trincaCentroOeste =  parseInt(codigo.slice(0, 3));
    if (trinca === 001 && trincaCentroOeste >= 201 && trincaCentroOeste <= 299) {
        return false;
    }
    return  true;
}

/* 
    Função para validar se o codigo é valido ou não de acordo com as regras de negócio

    1 Região de Origem 0 - 3
    2 Região de Destino 3 - 6
    3 Código da Loggi 6 - 9
    4 Código do Vendedor do produto 9- 12
    5 Tipo do produto 12 - 15
*/

const validadorDeCodigo = () => {
    inicio = [0, 3, 6, 9, 12];
    fim =  [3, 6, 9, 12, 15];
    let i = 0;
    while(i < inicio.length && i < fim.length){
        pacotes.map((item, index) => {
            let trinca =  parseInt(item.codigo.slice(parseInt(inicio[i]), parseInt(fim[i])));

            if (i === 0){
                if(!verificaRegiao(trinca)) { //Origem
                    item.valido = false;
                }
            } else if (i === 1) {
                if (!verificaRegiao(trinca)) { //Destino
                    item.valido = false;
                }
            } else if (i === 2) {
                if (!verificaCodLoggi(trinca)) {
                    item.valido = false;
                }
            } else if (i === 3) {
                if (!verificaCodVendedor(trinca)) {
                    item.valido = false;
                }
            } else if (i === 4){
                if (!verificaJoiasNoCentroOeste(trinca, item.codigo)) {
                    item.valido = false;
                }
                if (!verificaTipoProduto(trinca)) {
                    item.valido = false;
                }
            } else {
                console.log('ERRO DE INDEX');
            }
            
        })
        i++;
    }
}

// Separa string do codigo de barras para verificao necessaria
const separator = ( codigo, inicio, fim) => {
    let trinca = codigo.slice(parseInt(inicio), parseInt(fim))
    return trinca;
}


// Calcula destino e quantidade de cada pacote por regiao
let centroOeste = [], nordeste= [], norte = [], sudeste = [], sul = [];
let RegiaoInvalida = [];

const localizaRegiao = (inicio, fim) => {
    
    pacotes.map((item, index) => {
        let trinca = separator(item.codigo, parseInt(inicio), parseInt(fim));

        if(trinca >= 201 && trinca <= 299){
            centroOeste.push({name: item.name, codigo: item.codigo, valido: item.valido});
        } else if (trinca >= 300 && trinca <= 399) {
            nordeste.push({name: item.name, codigo: item.codigo, valido: item.valido});
        } else if (trinca >= 400 && trinca <= 499)  {
            norte.push({name: item.name, codigo: item.codigo, valido: item.valido});
        } else if (trinca >= 1 && trinca <= 99 ) {
            sudeste.push({name: item.name, codigo: item.codigo, valido: item.valido});
        } else if (trinca >= 100 && trinca <= 199){
            sul.push({name: item.name, codigo: item.codigo, valido: item.valido});
        } else {
            RegiaoInvalida.push({name: item.name, codigo: item.codigo, valido: item.valido})
        }
    })

}

//Necessario utilizar a funcao de Localizar regiao para imprimir
const imprimePacotesPorRegiao = () => {
    try {
        console.info('\nREGIAO CENTRO-OESTE' + '\nNumero de Pacotes nessa Regiao: ' + centroOeste.length)
        console.table(centroOeste);
        console.info('\nREGIAO NORDESTE' + '\nNumero de Pacotes nessa Regiao: ' + nordeste.length )
        console.table(nordeste);
        console.info('\nREGIAO NORTE' + '\nNumero de Pacotes nessa Regiao: ' + norte.length)
        console.table(norte);
        console.info('\nREGIAO SUDESTE' +  '\nNumero de Pacotes nessa Regiao: ' + sudeste.length)
        console.table(sudeste);
        console.info('\nREGIAO SUL' +  '\nNumero de Pacotes nessa Regiao: ' + sul.length)
        console.table(sul);
        console.info('\nREGIAO INVALIDA' +  '\nNumero de Pacotes com regiao invalida: ' + RegiaoInvalida.length)
        console.table(RegiaoInvalida);
        
    } catch (error) {
        console.log(error +  '\nFuncao utilizado fora da regra');
    }
}

// Lista pacotes validos e invalidos separados por tabela
const listaPacotesSeprados = () => {
    let validos = [], invalidos = [];
    pacotes.map((item, index) => {
        if (item.valido) {
            validos.push({name: item.name});
        } else {
            invalidos.push({name: item.name});
        }
    })

    console.info('\nPACOTES VALIDOS\n');
    console.table(validos);
    console.log('\n');
    console.info('PACOTES INVALIDOS\n');
    console.table(invalidos);
    console.log('\n');

}

//Lista invalidos
const listaPacotesInvalidos = () => {
    let invalidos = [];
    pacotes.map((item, index) => {
        if (!item.valido) {
            invalidos.push({name: item.name});
        }
    })

    console.info('PACOTES INVALIDOS\n');
    console.table(invalidos);
    console.log('\n');

}

// Listar pacotes por vendedor 
const listaPacotesVendedor = () => {
    pacotes.map((item, index) => {
        if (item.valido) {
            let trinca = separator(item.codigo, 9, 12);
            console.log('\nVENDEDOR: ' +  trinca  + '\nPACOTE: ' + item.name);
        }
    })

}

// Lista pacotes no Sul com brinquedos
const listaPacotesNoSulcomBrinquedos = () => {
    let sulBrinquedos = [];
    sul.map((item, index) => {
        let trinca = separator(item.codigo, 12, 15);
        if (trinca == 888){
            sulBrinquedos.push(item.name);
        }
    })
    if (sulBrinquedos.length === 0) {
        console.log('\nNao Ha Pacotes na Regiao Sul com Brinquedos\n');
    } else {
    console.info('\nLista dos Pacotes no SUL que contem Brinquedos\n');
    console.table(sulBrinquedos);
    }
}

//Captura tipo do produto
const getTipo = (trinca) => {
    if(trinca == 001){
        return 'JOIAS';
    } else if (trinca == 111) {
        return 'LIVROS';
    } else if (trinca  == 333)  {
        return 'ELETRONICOS';
    } else if (trinca == 555 ) {
        return 'BEBIDAS';
    } else if (trinca == 888){
        return 'BRINQUEDOS';
    } else {
    return 'TIPO INEXISTENTE';
    }
}

// Lista o Pacote com o seu Destino e seu Tipo
const listaDestinoETipo = () => {
    let tipoSul = [], tipoSudeste = [], tipoNordeste = [], tipoCentro = [], tipoNorte = []; 
    localizaRegiao(3, 6);
    sul.map((item, index) => {
        if (item.valido) {
            let trinca = separator(item.codigo, 12, 15);
            tipoSul.push({pacote: item.name, regiao: 'SUL', tipo: getTipo(trinca)});
        }
    })
    sudeste.map((item, index) => {
        if (item.valido) {
            let trinca = separator(item.codigo, 12, 15);
            tipoSudeste.push({pacote: item.name, regiao: 'SUDESTE', tipo: getTipo(trinca)});
        }
    })
    nordeste.map((item, index) => {
        if (item.valido) {
            let trinca = separator(item.codigo, 12, 15);
            tipoNordeste.push({pacote: item.name, regiao: 'NORDESTE', tipo: getTipo(trinca)});
        }
    })
    centroOeste.map((item, index) => {
        if (item.valido) {
            let trinca = separator(item.codigo, 12, 15);
            tipoCentro.push({pacote: item.name, regiao: 'CENTRO OESTE', tipo: getTipo(trinca)});
        }
    })
    norte.map((item, index) => {
        if (item.valido) {
            let trinca = separator(item.codigo, 12, 15);
            tipoNorte.push({pacote: item.name, regiao: 'NORTE', tipo: getTipo(trinca)});
        }
    })

    console.info('\nREGIAO SUL\n');
    console.table(tipoSul);
    console.info('\nREGIAO SUDESTE\n');
    console.table(tipoSudeste);
    console.info('\nREGIAO NORDESTE\n');
    console.table(tipoNordeste);
    console.info('\nREGIAO CENTRO OESTE\n');
    console.table(tipoCentro);
    console.info('\nREGIAO Norte\n');
    console.table(tipoNorte);

}

//Ordem de entrega dos pacotes nas regioes Centro Oeste e  Norte

const OrdenaCargaDosPacotes = () => {
    let ordenado = []
    localizaRegiao(3, 6);
    centroOeste.map((item, index) => {
        let trinca = separator(item.codigo, 12, 15);
        if(getTipo(trinca) == 'JOIAS') {
            ordenado.unshift(item)
        } else {
            ordenado.push(item);
        }
    })
    norte.map((item, index) => {
        let trinca = separator(item.codigo, 12, 15);
        if(getTipo(trinca) == 'JOIAS') {
            ordenado.splice(ordenado.length-1, 0, item)
        } else {
            ordenado.push(item);
        }
    })
    console.log('\n');
    console.table(ordenado);

}
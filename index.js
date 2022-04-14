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
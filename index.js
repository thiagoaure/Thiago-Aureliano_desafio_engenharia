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
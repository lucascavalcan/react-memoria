import { useEffect, useState } from "react";
import * as C from "./App.styles";

import logoImage from "./assets/devmemory_logo.png";
import RestartIcon from "./svgs/restart.svg";

import { Button } from "./components/Button";
import { InfoItem } from "./components/InfoItem"; 
import { GridItem } from "./components/GridItem";

import { GridItemType } from "./types/GridItemType";
import { items } from "./data/items";
import { formatTimeElapsed } from "./helpers/formatTimeElapsed";




const App = () => {

  const[playing, setPlaying] = useState<boolean>(false);
  const[timeElapsed, setTimeElapsed] = useState<number>(0);
  const[moveCount, setMoveCount] = useState<number>(0);
  const[shownCount, setShownCount] = useState<number>(0);
  const[gridItems, setGridItems] = useState<GridItemType[]>([]);

  useEffect(() => {
    resetAndCreateGrid();
  }, []);

  useEffect(()=>{
    const timer = setInterval(()=> {
      if (playing) {
        setTimeElapsed(timeElapsed + 1);
      }
    }, 1000);
    return() => clearInterval(timer)
  },[playing, timeElapsed]);

  //verify if the cards opened are equal
  useEffect(()=>{
    if (shownCount === 2){
      let opened = gridItems.filter(item => item.shown === true);
      if (opened.length === 2) {

        if (opened[0].item === opened[1].item){  //os dois itens do array são iguais
          // V1 - if both are equal, make the shown ones permanent
          let tmpGrid = [...gridItems];
          for (let i in tmpGrid) {
            if (tmpGrid[i].shown) {
              tmpGrid[i].permanentShown = true;
              tmpGrid[i].shown = false;
            }
          }
          setGridItems(tmpGrid);
          setShownCount(0);
        } else {
          //V2 - if they are NOT equal, close all the "shown"
          setTimeout(()=>{  //para, caso a carta esteja errada, não fechar automaticamente na mesma hora 
            let tmpGrid = [...gridItems];
            for (let i in tmpGrid) {
              tmpGrid[i].shown = false;
            }
            setGridItems(tmpGrid);
            setShownCount(0);
          }, 1000);
        }



        setMoveCount(moveCount => moveCount + 1);
      }
    }
  }, [shownCount, gridItems]);

  //verify if the game is over (all the options are "permanentshown")
  useEffect(()=>{
    if (moveCount > 0 && gridItems.every(item => item.permanentShown === true)) {
      setPlaying(false); //finish the game
    }
  }, [moveCount, gridItems]);

  function resetAndCreateGrid() {
    //step 1 - resetar o jogo
    setTimeElapsed(0);
    setMoveCount(0);
    setShownCount(0);

    //step 2 - criar o grid
    //2.1 - criar um grid vazio
    let tempGrid: GridItemType[] = [];
    for (let i = 0; i < (items.length * 2); i++) {
      tempGrid.push({
        item: null, //pois está, por enquanto, criando um grid vazio
        shown: false,
        permanentShown: false
      });
    }

    //2.2 - preencher o grid
    for (let w = 0; w < 2; w++) {
      for (let i = 0; i < items.length; i ++) {
        let pos = -1;
        while(pos < 0 || tempGrid[pos].item !== null) {
          pos = Math.floor(Math.random() * (items.length * 2)); //gerando um número aleatória (que seja menor que o dobro do número de cards - ja que eles aparecem 2vezes)
        }
        tempGrid[pos].item = i;  //ele sai do while e preenche o item, quando verifica que aquele item ainda não foi preenchido(caso contrário fica no while gerando outro número)
      }
    }

    //2.3 - jogar no state
    setGridItems(tempGrid);

    //step 3 - começar o jogo
    setPlaying(true);
  }

  function handleItemClick(index: number) {
    if (playing && index !==null && shownCount < 2) {
      let tmpGrid = [...gridItems];

      if(tmpGrid[index].permanentShown === false && tmpGrid[index].shown === false) {
        tmpGrid[index].shown = true;
        setShownCount(shownCount + 1);
      }

      setGridItems(tmpGrid)
    }
  }

  return (
    <C.Container>
      <C.Info> 
        <C.LogoLink>
          <img src={logoImage} width="200" alt=""/>
        </C.LogoLink>

        <C.InfoArea>
          <InfoItem label="Tempo" value={formatTimeElapsed(timeElapsed)} />
          <InfoItem label="Movimentos" value={moveCount.toString()} />
        </C.InfoArea>

        <Button label="Reiniciar" icon={RestartIcon} onClick={resetAndCreateGrid}/>
      </C.Info>
      <C.GridArea>
          <C.Grid>
            {gridItems.map((item, index)=>(
              <GridItem
                key={index}
                Item={item}
                onClick={()=> handleItemClick(index)}
              />
            ))}
          </C.Grid>
      </C.GridArea>
    </C.Container>
  );
}

export default App;

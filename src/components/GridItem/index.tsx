import { GridItemType } from "../../types/GridItemType";
import * as C from "./styles";
import b7svg from "../../svgs/b7.svg";
import { items } from "../../data/items";

type Props = {
    Item: GridItemType,
    onClick: () => void
}

export const GridItem = ({Item, onClick}: Props) => {
    return (
        <C.Container showBackGround={Item.permanentShown || Item.shown} onClick={onClick}>
            {Item.permanentShown === false && Item.shown === false &&
                <C.Icon src={b7svg} alt="" opacity={0.1}/>
            }
            {(Item.permanentShown || Item.shown) && Item.item !== null &&
                <C.Icon src={items[Item.item].icon} alt=""/>
            }
        </C.Container>
    );
}
import { _decorator, CCFloat, CCInteger, Collider2D, Component, Contact2DType, find, IPhysics2DContact, Node, Vec3 } from 'cc';
const { ccclass, property } = _decorator;

import { GameManager } from './GameManager';

@ccclass('CoinPickUp')
export class CoinPickUp extends Component {

    @property({type:CCFloat})
    private coinFallSpeed: number;

    private gameScript: GameManager;
    
    start() {
        this.gameScript = find('GameManager').getComponent(GameManager);
        var collider = this.node.getComponent(Collider2D);
        collider.on(Contact2DType.BEGIN_CONTACT, this.onCollisionEnter, this);
    }

    update(deltaTime: number) {
        if(!this.gameScript.gamePaused){
            var moveDownPos = this.node.position.add(new Vec3(0,-this.coinFallSpeed * deltaTime,0));
            this.node.setPosition(moveDownPos);
    
            if(this.node.position.y < -720){
                this.node.destroy();
            }
        }
    }

    onCollisionEnter(selfCollider: Collider2D, otherCollider: Collider2D, contact: IPhysics2DContact | null){
        if(otherCollider.tag === 1 && !this.gameScript.endGame){
            setTimeout(() => {
                this.gameScript.currentCoins += 5;
                this.gameScript.currentPoints += 10;
                this.node.destroy();
            }, 1);
        }
    }
}



import { _decorator, CCFloat, CCString, Collider2D, Component, Contact2DType, find, IPhysics2DContact, Node, Vec3 } from 'cc';
const { ccclass, property } = _decorator;

import { PlayerMovement } from './PlayerMovement';
import { GameManager } from './GameManager';

@ccclass('PowerUp')
export class PowerUp extends Component {

    @property({type:CCString})
    private powerType: string;

    @property({type:CCFloat})
    private fallSpeed: number;

    private playerScript: PlayerMovement;
    private gameScript: GameManager;

    start() {
        this.playerScript = find('Canvas/Player').getComponent(PlayerMovement);
        this.gameScript = find('GameManager').getComponent(GameManager);
        var collider = this.node.getComponent(Collider2D);
        collider.on(Contact2DType.BEGIN_CONTACT, this.onCollisionEnter, this);
    }

    update(deltaTime: number) {
        if(!this.gameScript.gamePaused){
            var movePos = this.node.position.add(new Vec3(0, -this.fallSpeed * deltaTime, 0));
            this.node.setPosition(movePos);
    
            if(this.node.position.y < -720){
                this.node.destroy();
            }
        }
    }

    onCollisionEnter(selfCollider: Collider2D, otherCollider: Collider2D, conatct: IPhysics2DContact | null){
        if(otherCollider.tag === 1 && !this.gameScript.endGame){
            if(this.powerType == 'Shield'){
                this.playerScript.isShieldPowered = true;
                setTimeout(() => {
                    this.node.destroy();
                }, 1);
            }
            else if(this.powerType == 'AmmoPower'){
                this.playerScript.isAmmoPowered = true;
                setTimeout(() => {
                    this.node.destroy();
                }, 1);
            }
        }
    }
}



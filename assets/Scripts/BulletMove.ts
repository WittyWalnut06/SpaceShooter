import { _decorator, CCFloat, Collider, Collider2D, Component, Contact2DType, find, IPhysics2DContact, Vec3 } from 'cc';
const { ccclass, property } = _decorator;

import { GameManager } from './GameManager';

@ccclass('BulletMove')
export class BulletMove extends Component {

    @property({type:CCFloat})
    private bulletSpeed: number;

    @property({type:CCFloat})
    public bulletDamage: number;

    private gameScript: GameManager;

    start() {
        this.gameScript = find('GameManager').getComponent(GameManager);
    }

    update(deltaTime: number) {
        const forwardPos = this.node.position.add(new Vec3(0,this.bulletSpeed * deltaTime,0));
        this.node.setPosition(forwardPos);
        if(this.gameScript.increaseDamage){
            this.bulletDamage += 2;
        }
    }
}



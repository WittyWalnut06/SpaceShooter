import { _decorator, BoxCollider2D, CCInteger, Component, Input, input, instantiate, Node, Prefab, RigidBody, Vec3, EventKeyboard, macro, debug, KeyCode, CCFloat, EventTouch, find } from 'cc';
const { ccclass, property } = _decorator;

import { PlayerMovement } from './PlayerMovement';
import { GameManager } from './GameManager';

@ccclass('PlayerShooting')
export class PlayerShooting extends Component {

    @property({type:Prefab})
    private playerBullet: Prefab;

    @property({type:CCFloat})
    public firerate: number;
    private shootTime: number = 0;

    @property({type:CCFloat})
    private xOffset: number;

    private isTouching: boolean = false;
    private playerScript: PlayerMovement;
    private gameScript: GameManager;

    start() {
        input.on(Input.EventType.TOUCH_START, this.onTouchStart, this);
        input.on(Input.EventType.TOUCH_END, this.onTouchEnd,this);
        this.playerScript = find('Canvas/Player').getComponent(PlayerMovement);
        this.gameScript = find('GameManager').getComponent(GameManager);
    }
    
    update(deltaTime: number) {
        if(!this.gameScript.gamePaused){
            this.shootTime += deltaTime;
            if(this.isTouching && this.shootTime >= this.firerate && !this.playerScript.isAmmoPowered){
                this.Shoot();
                this.shootTime = 0;
            }
            else if(this.isTouching && this.shootTime>= this.firerate && this.playerScript.isAmmoPowered){
                this.PowerShoot();
                this.shootTime = 0;
            }
        }
    }
    
    onTouchStart(event: EventTouch){
        this.isTouching = true;
    }
    onTouchEnd(event: EventTouch){
        this.isTouching = false;
    }

    Shoot(){
        const bullet = instantiate(this.playerBullet);
        const bgNode = this.node.scene.getChildByName('Canvas').getChildByName('Background');
        bgNode.addChild(bullet);
        bullet.setPosition(this.node.position);

        this.scheduleOnce(()=>{
            bullet.destroy();
        },4);
    }

    PowerShoot(){
        //LEFT BULLETS
        const bulletLeft = instantiate(this.playerBullet);
        const bgNode = this.node.scene.getChildByName('Canvas').getChildByName('Background');
        bgNode.addChild(bulletLeft);
        bulletLeft.setPosition(this.node.position.x + (-this.xOffset),this.node.position.y);
        //RIGHT BULLETS
        const bulletRight = instantiate(this.playerBullet);
        bgNode.addChild(bulletRight);
        bulletRight.setPosition(this.node.position.x + (this.xOffset),this.node.position.y);

        this.scheduleOnce(()=>{
            bulletLeft.destroy();
            bulletRight.destroy();
        },4)
    }
}



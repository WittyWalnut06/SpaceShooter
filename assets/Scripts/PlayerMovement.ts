import { _decorator, Component, input, Input, Node, Vec2, EventTouch, Vec3, CameraComponent, CCFloat, RigidBody2D, CCInteger, find, Prefab} from 'cc';
const { ccclass, property } = _decorator;

import { GameManager } from './GameManager';

@ccclass('PlayerMovement')
export class PlayerMovement extends Component {
    
    @property({ type: Vec2})
    private speed: Vec2 = new Vec2(200,200);

    @property({type:CCFloat})
    private xOffset: number;
    @property({type:CCFloat})
    private yOffset: number;

    @property({type:CCInteger})
    public shieldTimer1: number;
    @property({type:CCInteger})
    private shieldTimer2: number;
    @property({type:CCInteger})
    public ammoTimer: number;

    @property({type:Node})
    private shieldGraphic: Node;
    @property({type:Node})
    private shieldWeakGraphic: Node;
    @property({type:Prefab})
    public burstParticle: Prefab;

    private isTouching: boolean = false;
    private touchPos: Vec2 = new Vec2();

    public isAmmoPowered: boolean = false;
    public ammoActivated: boolean = false;
    public isShieldPowered: boolean = false;
    public shieldActivated: boolean = false;

    private gameScript: GameManager;
   
    start() {
        input.on(Input.EventType.TOUCH_START, this.onTouchStart, this);
        input.on(Input.EventType.TOUCH_MOVE, this.onTouchMove, this);
        input.on(Input.EventType.TOUCH_END, this.onTouchEnd, this);
        input.on(Input.EventType.TOUCH_CANCEL, this.onTouchEnd, this);
        this.shieldGraphic.active = false;
        this.shieldWeakGraphic.active = false;
        this.gameScript = find('GameManager').getComponent(GameManager);
    }

    update(deltaTime: number) {
        if(this.isTouching && !this.gameScript.gamePaused){
            const screenPos = new Vec3(this.touchPos.x, this.touchPos.y, 0);
            const adjustedPos = screenPos.add(new Vec3(this.xOffset,this.yOffset,0));
            const newPos = this.node.position.lerp(adjustedPos, deltaTime * this.speed.x);
            this.node.setPosition(newPos);
        }
        this.boundaryCheck();

        //AMMO POWER UP
        if(this.isAmmoPowered && !this.ammoActivated){
            this.ammoActivated = true;
            this.scheduleOnce(this.ammoPowerUp,this.ammoTimer);
        }
        //SHIELD POWER UP
        if(this.isShieldPowered && !this.shieldActivated){
            this.shieldGraphic.active = true;
            this.shieldActivated = true;
            this.scheduleOnce(this.shieldPowerUp1,this.shieldTimer1);
        }
    }

    onTouchStart(event: EventTouch){
        this.isTouching = true;
        this.touchPos.set(event.getLocation());
    }

    onTouchMove(event: EventTouch){
        this.touchPos.set(event.getLocation());
    }

    onTouchEnd(event: EventTouch){
        this.isTouching = false;
    }

    boundaryCheck(){
        if(this.node.position.x < -150){
            this.node.setPosition(new Vec3(-150,this.node.position.y,0));
        }
        if(this.node.position.x > 150){
            this.node.setPosition(new Vec3(150,this.node.position.y,0));
        }
        if(this.node.position.y > 295){
            this.node.setPosition(new Vec3(this.node.position.x, 295, 0));
        }
        if(this.node.position.y < -295){
            this.node.setPosition(new Vec3(this.node.position.x, -295, 0));
        }
    }

    //SHIELD POWER UP
    shieldPowerUp1(){
        this.shieldGraphic.active = false;
        this.shieldWeakGraphic.active = true;
        this.scheduleOnce(this.shieldPowerUp2,this.shieldTimer2);
    }
    shieldPowerUp2(){
        this.shieldActivated = false;
        this.isShieldPowered = false;
        this.shieldWeakGraphic.active = false;
    }

    //AMMO POWER UP
    ammoPowerUp(){
        this.isAmmoPowered = false;
        this.ammoActivated = false;
    }
}



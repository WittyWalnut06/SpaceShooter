import { _decorator, CCInteger, Component, find, Node, Vec3 } from 'cc';
const { ccclass, property } = _decorator;

import { GameManager } from './GameManager';

@ccclass('BackgroundMove')
export class BackgroundMove extends Component {

    @property({ type: Node })
    private bg1: Node;
    @property({ type: Node })
    private bg2: Node;

    @property({type:CCInteger})
    public scrollSpeed: number;

    private scrollPosition1: Vec3;
    private scrollPosition2: Vec3;

    public scrollCount: number = 0;
    @property({type:CCInteger})
    public maxScrollCount: number = 20;

    private gameScript: GameManager;

    start() {
        this.gameScript = find('GameManager').getComponent(GameManager);
    }

    update(deltaTime: number) {
        if(!this.gameScript.gamePaused){
            this.ScrollDown(deltaTime);
    
            this.ResetPosition();
    
            if(this.scrollCount>=this.maxScrollCount){
                this.scrollCount = 0;
                this.gameScript.toNextLevel = true;
                this.gameScript.currLevelCount++;
                this.gameScript.nextLevelcount++;
            }
        }
    }

    ScrollDown(deltaTime: number){
        this.scrollPosition1 = this.bg1.position.add(new Vec3(0,-this.scrollSpeed * deltaTime));
        this.bg1.setPosition(this.scrollPosition1);
        this.scrollPosition2 = this.bg2.position.add(new Vec3(0,-this.scrollSpeed * deltaTime));
        this.bg2.setPosition(this.scrollPosition2);
    }

    ResetPosition()
    {
        if(this.bg1.position.y <= -720){
            if(!this.gameScript.endGame){
                this.scrollCount++;
            }
            this.bg1.setPosition(new Vec3(0,720,0));
        }
        if(this.bg2.position.y <= -720){
            if(!this.gameScript.endGame){
                this.scrollCount++;
            }   
            this.bg2.setPosition(new Vec3(0,720,0));
        }
    }
}



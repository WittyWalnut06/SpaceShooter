import { _decorator, CCInteger, Component, director, find, Game, Label, Node, Prefab, ProgressBar, RichText } from 'cc';
const { ccclass, property } = _decorator;

import { BackgroundMove } from './BackgroundMove';
import { SpawnAsteroid } from './SpawnAsteroid';
import { PlayerShooting } from './PlayerShooting';
import { PlayerMovement } from './PlayerMovement';

@ccclass('GameManager')
export class GameManager extends Component {

    @property({type:RichText})
    private pointsText: RichText;
    @property({type:RichText})
    private finalScoreText: RichText;
    @property({type:RichText})
    private levelText: RichText;

    @property({type:RichText})
    private endText: RichText;
    @property({type:RichText})
    private endTextBelow: RichText;

    @property({type:RichText})
    private currPlanet: RichText;
    @property({type:RichText})
    private nextPlanet: RichText;

    @property({type:ProgressBar})
    private progressBar: ProgressBar;

    @property({type:RichText})
    private coinText: RichText;

    //GAME SCREENS
    @property({type:Node})
    private finishScreen: Node;
    @property({type:Node})
    private purchaseScreen: Node;

    //UPGRADE COSTS
    @property({type:Label})
    private fireRateText: Label;
    @property({type:CCInteger})
    private fireRateCost: number;
    private boughtFR: boolean = false;

    @property({type:Label})
    private powerText: Label;
    @property({type:CCInteger})
    private powerCost: number;
    private boughtPower: boolean = false;

    @property({type:Label})
    private damageText: Label;
    @property({type:CCInteger})
    private damageCost: number;
    private boughtDamage: boolean = false;
    public increaseDamage: boolean = false;

    //OTHER SCRIPTS
    private backGroundScript: BackgroundMove;
    private asteroidScript: SpawnAsteroid;
    private shootScript: PlayerShooting;
    private playerScript: PlayerMovement;

    public currentPoints: number = 0;
    public currLevelCount:number = 1;
    public nextLevelcount:number = 2;
    public toNextLevel: boolean = false;
    private nextLevelFlag: boolean = false;

    public currentCoins: number = 0;

    public endGame: boolean = false;
    private endGameFlag: boolean = false;

    public levelTimeOut: boolean = false;
    private levelTimeOutFlag: boolean = false;

    public gamePaused: boolean = false;
    public increaseHitpoints: boolean = false;

    start() {
        this.endGame = false;
        this.endGameFlag = false;
        this.backGroundScript = find('Canvas/Background').getComponent(BackgroundMove);
        this.asteroidScript = find('AsteroidSpawnManager').getComponent(SpawnAsteroid);
        this.shootScript = find('Canvas/Player').getComponent(PlayerShooting);
        this.playerScript = find('Canvas/Player').getComponent(PlayerMovement);
        this.valueInitialization();
    }

    update(deltaTime: number) {
        if(this.toNextLevel && !this.nextLevelFlag){
            this.nextLevelFlag = true;
            this.NextLevel();
        }

        this.valueUpdate();

        if(this.endGame && !this.endGameFlag){
            this.endGameFlag = true;
            this.CrashEndGame();
        }
        else if(this.currLevelCount==4 && !this.endGameFlag){
            this.endGameFlag = true;
            this.EndGame();
        }

        if(this.levelTimeOut && !this.levelTimeOutFlag && this.currLevelCount<4){
            this.PurchaseMenu();
        }

    }

    //START AND UPDATE
    valueInitialization(){
        this.finishScreen.active = false;
        this.purchaseScreen.active = false;
        this.progressBar.progress = 0;
        this.currentCoins = 0;
        this.pointsText.string = 'Score '+ this.currentPoints.toString();
        this.levelText.string = 'Level '+ this.currLevelCount,toString();
        this.currPlanet.string = this.currLevelCount.toString();
        this.nextPlanet.string = this.nextLevelcount.toString();
        this.coinText.string = this.currentCoins.toString();
    }
    valueUpdate(){
        this.levelText.string = 'Level '+ this.currLevelCount.toString();
        this.progressBar.progress = this.backGroundScript.scrollCount/this.backGroundScript.maxScrollCount;
        this.currPlanet.string = this.currLevelCount.toString();
        this.nextPlanet.string = this.nextLevelcount.toString();
        this.coinText.string = this.currentCoins.toString();
        if(!this.endGame){
            this.pointsText.string = 'Score '+ this.currentPoints.toString();
            this.finalScoreText.string = 'Your score: '+ this.currentPoints.toString();
        }
    }

    //NEXT LEVEL
    NextLevel(){
        this.backGroundScript.scrollSpeed *= 1.5;
        this.backGroundScript.maxScrollCount *= 1.5;
        this.asteroidScript.spawnDelay -= 0.18;
        this.asteroidScript.spawnCount += 2;
        this.increaseHitpoints = true;
        this.toNextLevel = false;
        this.nextLevelFlag = false;
        this.levelTimeOut = true;
    }

    //GAME ENDINGS
    EndGame(){
        this.backGroundScript.scrollSpeed *= 0.4;
        this.endText.string = 'AWESOME!'
        this.endTextBelow.string = "You've made it to the end!";
        this.finishScreen.active = true;
        this.endGame = true;
    }
    CrashEndGame(){
        console.info("WORKING!");
        this.backGroundScript.scrollSpeed *= 0.4;
        this.endText.string = 'OH NO!'
        this.endTextBelow.string = 'Your ship got wrecked!';
        this.finishScreen.active = true;
    }
    RestartGame(){
        this.finishScreen.active = false;
        director.loadScene('scene');
    }

    //PURCHASE MENU
    PurchaseMenu(){
        if(!this.boughtFR){
            this.fireRateText.string = this.fireRateCost.toString();
        }
        if(!this.boughtDamage){
            this.damageText.string = this.damageCost.toString();
        }
        if(!this.boughtPower){
            this.powerText.string = this.powerCost.toString();
        }
        this.levelTimeOutFlag = true;
        this.PauseGame();
        this.purchaseScreen.active = true;
    }
    PauseGame(){
        this.gamePaused = true;
    }
    ResumeGame(){
        this.gamePaused = false;
        this.purchaseScreen.active = false;
        this.levelTimeOutFlag = false;
        this.levelTimeOut = false;
    }

    //UPGRADES
    IncreaseFireRate(){
        if(this.currentCoins>=this.fireRateCost && !this.boughtFR){
            this.fireRateText.string = 'Got';
            this.boughtFR = true;
            this.currentCoins -= this.fireRateCost;
            this.shootScript.firerate = 0.12;
        }
    }
    IncreaseDamage(){
        if(this.currentCoins>=this.damageCost && !this.boughtDamage){
            this.damageText.string = 'Got';
            this.boughtDamage = true;
            this.currentCoins -= this.damageCost;
            this.increaseDamage = true;
        }
    }
    IncreasePowerTime(){
        if(this.currentCoins>=this.powerCost && !this.boughtPower){
            this.powerText.string = 'Got';
            this.boughtPower = true;
            this.currentCoins -= this.powerCost;
            this.playerScript.ammoTimer *= 1.5;
            this.playerScript.shieldTimer1 *= 1.5;
        }
    }
}



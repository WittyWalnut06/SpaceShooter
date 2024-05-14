import { _decorator, CCFloat, CCInteger, Component, find, instantiate, math, Node, Prefab, random, Vec3 } from 'cc';
import { GameManager } from './GameManager';
const { ccclass, property } = _decorator;

@ccclass('SpawnAsteroid')
export class SpawnAsteroid extends Component {

    @property({type:Prefab})
    private asteroidPrefab: Prefab;
    @property({type:Prefab})
    private ammoPrefab: Prefab;
    @property({type:Prefab})
    private shieldPrefab: Prefab;

    @property({type:Node})
    private spawnPositions: Node[] = [];

    @property({type:CCFloat})
    public spawnDelay: number;
    @property({type:CCFloat})
    private spawnPickUpDelay: number;
    @property({type:CCInteger})
    public spawnCount: number = 4;

    private taken: number = 0;
    private gameScript: GameManager;

    start() {
        this.gameScript = find('GameManager').getComponent(GameManager);
        this.scheduleOnce(this.startSpawn,1);
    }

    startSpawn(){
        this.schedule(this.spawnAsThree,this.spawnDelay);
        this.schedule(this.startPickUpSpawn,this.spawnPickUpDelay);
    }

    spawnAsThree(){
        for(let i=0;i<this.spawnCount;i++){
            const randomPosIndex = Math.floor(Math.random()*this.spawnPositions.length);
            if(randomPosIndex != this.taken){
                const randomPos = this.spawnPositions[randomPosIndex].position;
                this.spawnAsteroid(randomPos);
                this.taken = randomPosIndex;
            }
        }
    }

    spawnAsteroid(randomPosition: Vec3){
        if(!this.gameScript.endGame){
            if(!this.gameScript.gamePaused){
                const asteroid = instantiate(this.asteroidPrefab);
                const bgNode = this.node.scene.getChildByName('Canvas').getChildByName('Background');
                bgNode.addChild(asteroid);
                asteroid.setPosition(randomPosition);
            }
        }
    }

    startPickUpSpawn(){
        const randomPosIndex = Math.floor(Math.random()*this.spawnPositions.length);
        const randomPos = this.spawnPositions[randomPosIndex].position;
        this.spawnPickUp(randomPos);
    }

    spawnPickUp(randomPosition: Vec3){
        if(!this.gameScript.endGame){
            if(!this.gameScript.gamePaused){
                var randomIndex = Math.floor(math.randomRange(1,3));
                if(randomIndex === 1){
                    const ammo = instantiate(this.ammoPrefab);
                    const bgNode = this.node.scene.getChildByName('Canvas');
                    bgNode.addChild(ammo);
                    ammo.setPosition(randomPosition);
                }
                else if(randomIndex === 2){
                    const shield = instantiate(this.shieldPrefab);
                    const bgNode = this.node.scene.getChildByName('Canvas');
                    bgNode.addChild(shield);
                    shield.setPosition(randomPosition);
                }
            }
        }
    }

    update(deltaTime: number) {
        
    }
}



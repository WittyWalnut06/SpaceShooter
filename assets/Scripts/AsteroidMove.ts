import { _decorator, BoxCollider2D, CCFloat, CCInteger, Collider2D, ColliderComponent, CollisionEventType, Component, Contact2DType, find, instantiate, IPhysics2DContact, Label, math, Node, ParticleAsset, Prefab, RigidBody, RigidBody2D, Vec3 } from 'cc';
const { ccclass, property } = _decorator;

import { PlayerMovement } from './PlayerMovement';
import { BulletMove } from './BulletMove';
import { GameManager } from './GameManager';

@ccclass('AsteroidMove')
export class AsteroidMove extends Component {

    @property({type:Prefab})
    private coinPrefab: Prefab;
    @property({type:Prefab})
    private burstParticle: Prefab;

    @property({type:CCFloat})
    private asteroidSpeed: number;

    @property({type:CCInteger})
    private healthRange: number;
    private maxHealth: number;
    private currentHealth: number;

    @property({type:Label})
    private hitPoints: Label;

    private playerScript: PlayerMovement;
    private gameScript: GameManager;

    start() {
        this.playerScript = find('Canvas/Player').getComponent(PlayerMovement);
        this.gameScript = find('GameManager').getComponent(GameManager);

        if(this.gameScript.increaseHitpoints){
            this.maxHealth = Math.floor(math.randomRange(1,this.healthRange));
        }
        else
        {
            this.maxHealth = Math.floor(math.randomRange(1,5));
        }

        this.currentHealth = this.maxHealth;
        this.hitPoints.string = this.currentHealth.toString();

        let collider = this.node.getComponent(Collider2D);
        if(collider){
            collider.on(Contact2DType.BEGIN_CONTACT,this.onCollisionEnter,this);
        }
    }

    update(deltaTime: number) {
        if(!this.gameScript.gamePaused){
            const movePos = this.node.position.add(new Vec3(0,-this.asteroidSpeed * deltaTime,0));
            this.node.setPosition(movePos);
    
            this.hitPoints.string = this.currentHealth.toString();
    
            if(this.currentHealth <= 0){
                //DROP COINS
                setTimeout(() => {
                    this.gameScript.currentPoints += 10;
                    var coin = instantiate(this.coinPrefab);
                    var particle = instantiate(this.burstParticle);
                    this.node.scene.getChildByName('Canvas').getChildByName('Background').addChild(coin);
                    this.node.scene.getChildByName('Canvas').getChildByName('Background').addChild(particle);
                    coin.setPosition(this.node.position);
                    particle.setPosition(this.node.position);
                    this.node.destroy();
                }, 1);
            }
    
            if(this.node.position.y < -720){
                this.node.destroy();
            }
        }
    }

    onCollisionEnter(selfCollider: Collider2D, otherCollider: Collider2D, contact: IPhysics2DContact | null){
        //COLLIDE WITH PLAYER
        if(otherCollider.tag === 1 && !this.gameScript.endGame){
            setTimeout(() => {
                if(!this.playerScript.isShieldPowered){
                    this.gameScript.endGame = true;
                    otherCollider.node.destroy();
                    var shipParticle = instantiate(this.playerScript.burstParticle);
                    this.node.scene.getChildByName('Canvas').getChildByName('Background').addChild(shipParticle);
                    shipParticle.setPosition(otherCollider.node.position);
                }
                var particle = instantiate(this.burstParticle);
                this.node.scene.getChildByName('Canvas').getChildByName('Background').addChild(particle);
                particle.setPosition(this.node.position);
                this.node.destroy();
            }, 1)
        }

        //COLLIDE WITH BULLETS
        if(otherCollider.tag === 2){
            setTimeout(() => {
                otherCollider.node.destroy();
                this.currentHealth -= otherCollider.getComponent(BulletMove).bulletDamage;
            }, 1);
        }
    }
}



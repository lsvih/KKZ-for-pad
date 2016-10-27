#import "JPUSHService.h"
#import "PGJiguanPush.h"
@interface PGJiguanPush()
{
    Boolean registeredStatus ;
   
}
@end
@implementation PGJiguanPush
//获取自定义消息
//static PGJiguanPush * manager = Nil;
// +(PGJiguanPush *)sharePGJGManager
// {
//     @synchronized(self)
//     {
//         if (!manager) {
//             manager = [[PGJiguanPush alloc]init];
//         }
//         return manager;
        
//     }
// }
// +(id)alloc
// {
//     @synchronized(self)
//     {
//         if (!manager) {
//             manager =[super alloc];
//         }
//         return manager;
//     }
// }
// -(id)init
// {
//     if (self = [super init])
//     {
  //       NSNotificationCenter *defaultCenter = [NSNotificationCenter defaultCenter];
  // [defaultCenter addObserver:self
  //                   selector:@selector(networkDidSetup:)
  //                       name:kJPFNetworkDidSetupNotification
  //                     object:nil];
  // [defaultCenter addObserver:self
  //                   selector:@selector(networkDidClose:)
  //                       name:kJPFNetworkDidCloseNotification
  //                     object:nil];
  // [defaultCenter addObserver:self
  //                   selector:@selector(networkDidRegister:)
  //                       name:kJPFNetworkDidRegisterNotification
  //                     object:nil];
  // [defaultCenter addObserver:self
  //                   selector:@selector(networkDidLogin:)
  //                       name:kJPFNetworkDidLoginNotification
  //                     object:nil];
  // [defaultCenter addObserver:self
  //                   selector:@selector(networkDidReceiveMessage:)
  //                       name:kJPFNetworkDidReceiveMessageNotification
  //                     object:nil];
  // [defaultCenter addObserver:self
  //                   selector:@selector(serviceError:)
  //                       name:kJPFServiceErrorNotification
  //                     object:nil];
//     }
//     return self;
// }
#pragma mark 插件方法
//设置tags 、alias
- (void)PluginSetTagsFunction:(PGMethod*)commands
{
    if ( commands ) {
        
        NSString* cbId = [commands.arguments objectAtIndex:0];
        NSString* pArgument1 = [commands.arguments objectAtIndex:1]; // tags
        NSString* pArgument2 = [commands.arguments objectAtIndex:2]; // alias
        NSSet * tags = [NSSet setWithObject:pArgument1];
        
       [JPUSHService setTags:tags alias:pArgument2 fetchCompletionHandle:^(int iResCode, NSSet *iTags, NSString *iAlias){
        
        NSArray* pResultString = [NSArray arrayWithObjects:[NSString stringWithFormat:@"%d",iResCode], iTags, iAlias,  nil];
       PDRPluginResult *  result = [PDRPluginResult resultWithStatus:PDRCommandStatusOK messageAsArray: pResultString];
        
         [self toCallback:cbId withReslut:[result toJSONString]];
        }];
    }
}
//获取 RegistrationID
- (void)PluginGetRegistrationIDFunction:(PGMethod*)commands
{
    NSNotificationCenter *defaultCenter = [NSNotificationCenter defaultCenter];
    [defaultCenter addObserver:self
                      selector:@selector(changeStatus)
                          name:kJPFNetworkDidLoginNotification
                        object:nil];
    
    
    
    if ( commands && registeredStatus) {
        
        NSString* cbId = [commands.arguments objectAtIndex:0];
        
        [self toCallback:cbId withReslut:[JPUSHService registrationID]];
        
    }
}
-(void)changeStatus
{
    registeredStatus = 1;
}
//- (void)networkDidSetup:(NSNotification *)notification {}
//- (void)networkDidClose:(NSNotification *)notification {}
// - (void)networkDidRegister:(NSNotification *)notification {}
// - (void)networkDidLogin:(NSNotification *)notification {}
//- (void)networkDidReceiveMessage:(NSNotification *)notification {}
// - (void)serviceError:(NSNotification *)notification {｝
// - (void)unObserveAllNotifications {
//   NSNotificationCenter *defaultCenter = [NSNotificationCenter defaultCenter];
//   [defaultCenter removeObserver:self
//                            name:kJPFNetworkDidSetupNotification
//                          object:nil];
//   [defaultCenter removeObserver:self
//                            name:kJPFNetworkDidCloseNotification
//                          object:nil];
//   [defaultCenter removeObserver:self
//                            name:kJPFNetworkDidRegisterNotification
//                          object:nil];
//   [defaultCenter removeObserver:self
//                            name:kJPFNetworkDidLoginNotification
//                          object:nil];
//   [defaultCenter removeObserver:self
//                            name:kJPFNetworkDidReceiveMessageNotification
//                          object:nil];
//   [defaultCenter removeObserver:self
//                            name:kJPFServiceErrorNotification
//                          object:nil];
// }
//- (void)serviceError:(NSNotification *)notification {}
@end

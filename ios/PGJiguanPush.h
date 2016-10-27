#import "PGPlugin.h"
#import "PGMethod.h"
@interface PGJiguanPush : PGPlugin
// +(id)alloc
// +(PGJiguanPush *)sharePGJGManager
- (void)PluginSetTagsFunction:(PGMethod*)commands;
- (void)PluginGetRegistrationIDFunction:(PGMethod*)commands;
- (void)changeStatus;
@end


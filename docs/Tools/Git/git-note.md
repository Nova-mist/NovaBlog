## 后加入的忽略文件

如何删除远程仓库中没有及时添加到 `.gitignore` 的文件？

因为在本地仓库中，应该被忽略的文件（没有在一开始就添加进 `.gitignore`）已经是 track 的状态，所以需要先在追踪清单中删除（不是删除本地文件）。

```bash
git rm --cached FILENAME
```

然后再正常提交、推送到远程仓库进行 merge。



**查看被 git 监测的文件**

```bash
git ls-tree --full-tree --name-only  -r [branch_name]
```







## 工作区、暂存区、版本库

工作区：电脑里能看到的目录

版本库：工作区中的隐藏目录 `.git`

暂存区：版本库中的索引文件 `.git/index`

[Git 工作区、暂存区和版本库 | 菜鸟教程 (runoob.com)](https://www.runoob.com/git/git-workspace-index-repo.html)

一般流程：

1. `git diff` 比较工作区和暂存区的变化
2. `git add` 添加文件变动到暂存区
3. `git comit` 将文件变动从暂存区提交到版本库
4. `git checkout` 切换分支，用版本库的快照替换工作区



## 远程仓库

**推送**

```bash
git push -u origin main

git push # 第二次推送就可以省略分支
```

`-u` 选项的作用是添加远程仓库流，下次直接使用 `git push` 就能直接推送到绑定的分支。

**拉取**

`git pull` 在直观感受上等于 `git fetch` + `git merge`



**连接新建的远程空项目**

```bash
git remote add origin git@github.com:Nova-mist/xxxx.git
git branch -M main # 更改分支名 master -> main
git push -u origin main # -u 设置推送流 以后 git push 默认推送此流
```



**删除远程仓库**

```bash
git branch -a
git push origin --delete xxx
```

如果报错 `remote ref does not exist` 就需要清除远程分支的本地缓存

```bash
git fetch -p origin
```



获取远程的分支

```bash
git fetch -u
```



**克隆指定分支**

- fetch 所有分支，checkout 到指定分支，会 track 所有分支
  ```java
  git clone -b [branchname] [remote-repo-url]
  ```

- 只 fetch 单独的分支，这样只会 track 此分支
  ```java
  git clone -b [branchname] --single-branch [remote-repo-url]
  ```

参考：[Git Clone Branch – How to Clone a Specific Branch (freecodecamp.org)](https://www.freecodecamp.org/news/git-clone-branch-how-to-clone-a-specific-branch/)

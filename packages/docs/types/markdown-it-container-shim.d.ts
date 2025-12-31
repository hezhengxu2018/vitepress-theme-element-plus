declare module 'markdown-it-container' {
  import type Renderer from 'markdown-it/lib/renderer'
  import type { MarkdownRenderer } from 'vitepress'

  interface ContainerOpts {
    marker?: string
    validate?: (params: string) => boolean
    render?: Renderer.RenderRule
  }

  interface ContainerPlugin {
    (md: MarkdownRenderer, name: string, opts?: ContainerOpts): void
    (md: MarkdownRenderer, ...params: any[]): void
  }

  const markdownItContainer: ContainerPlugin
  export default markdownItContainer
}
